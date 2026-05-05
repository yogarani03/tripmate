// ---------------- MOCK DATA ----------------
const trips = [
    { type: "Bus", price: 1000 },
    { type: "Train", price: 800 },
    { type: "Flight", price: 3000 }
];

// ---------------- BOOKING ID ----------------
function generateBookingId() {
    return "TM" + Math.floor(1000 + Math.random() * 9000);
}

// ---------------- SEARCH ----------------
function searchTrips() {

    let source = document.getElementById("source").value;
    let destination = document.getElementById("destination").value;
    let error = document.getElementById("error");

    if (!source || !destination) {
        error.innerText = "Please select both source and destination";
        return;
    }

    if (source === destination) {
        error.innerText = "Source and Destination cannot be same";
        return;
    }

    error.innerText = "";

    localStorage.setItem("searchData", JSON.stringify({ source, destination }));
    window.location.href = "results.html";
}

// ---------------- RESULTS ----------------
if (document.getElementById("list")) {

    let searchData = JSON.parse(localStorage.getItem("searchData"));

    if (!searchData) {
        document.body.innerHTML = "<h2>No Search Data</h2>";
    } else {

        document.getElementById("route").innerText =
            searchData.source + " → " + searchData.destination;

        let list = document.getElementById("list");

        trips.forEach(t => {

            let div = document.createElement("div");
            div.className = "trip";

            div.innerHTML = `
                <p>${searchData.source} → ${searchData.destination}</p>
                <p>${t.type} - Rs. ${t.price}</p>
                <button onclick="book(${t.price})">Book</button>
            `;

            list.appendChild(div);
        });
    }
}

// ---------------- BOOK ----------------
function book(price) {

    let searchData = JSON.parse(localStorage.getItem("searchData"));

    let booking = {
        id: generateBookingId(),
        route: searchData.source + " → " + searchData.destination,
        price: price,
        status: "Pending"
    };

    localStorage.setItem("bookingData", JSON.stringify(booking));
    window.location.href = "booking.html";
}

// ---------------- BOOKING PAGE ----------------
if (document.getElementById("bookingId")) {

    let bookingData = JSON.parse(localStorage.getItem("bookingData"));

    if (bookingData) {
        document.getElementById("bookingId").innerText = "Booking ID: " + bookingData.id;
        document.getElementById("route").innerText = bookingData.route;
        document.getElementById("price").innerText = "Price: Rs. " + bookingData.price;
    }
}

// ---------------- SAVE HISTORY ----------------
function saveToHistory(booking) {

    let bookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    bookings.push(booking);
    localStorage.setItem("allBookings", JSON.stringify(bookings));
}

// ---------------- CONFIRM ----------------
function confirmBooking() {

    let bookingData = JSON.parse(localStorage.getItem("bookingData"));
    bookingData.status = "Confirmed";

    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    saveToHistory(bookingData);

    document.getElementById("msg").innerText = "Booking Confirmed ✅";

    setTimeout(() => {
        window.location.href = "itinerary.html";
    }, 1000);
}

// ---------------- CANCEL ----------------
function cancelBooking() {

    let bookingData = JSON.parse(localStorage.getItem("bookingData"));

    let refund = bookingData.price * 0.9;
    bookingData.status = "Cancelled";

    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    saveToHistory(bookingData);

    document.getElementById("msg").innerText =
        "Booking Cancelled ❌ Refund: Rs. " + refund;

    setTimeout(() => {
        window.location.href = "itinerary.html";
    }, 1000);
}

// ---------------- ITINERARY ----------------
if (document.getElementById("itineraryList")) {

    let bookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    let latest = JSON.parse(localStorage.getItem("bookingData"));

    let latestDiv = document.getElementById("latestBooking");
    let container = document.getElementById("itineraryList");

    // Latest booking
    if (latest) {
        latestDiv.innerHTML = `
            <div class="trip">
                <p><strong>ID:</strong> ${latest.id}</p>
                <p>${latest.route}</p>
                <p>Price: Rs. ${latest.price}</p>
                <p>Status: ${latest.status}</p>
            </div>
        `;
    }

    // History
    if (bookings.length === 0) {
        container.innerHTML = "<p>No previous bookings</p>";
    } else {
        bookings.forEach(b => {
            let div = document.createElement("div");
            div.className = "trip";

            div.innerHTML = `
                <p><strong>ID:</strong> ${b.id}</p>
                <p>${b.route}</p>
                <p>Price: Rs. ${b.price}</p>
                <p>Status: ${b.status}</p>
            `;

            container.appendChild(div);
        });
    }
}