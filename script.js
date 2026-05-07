// ---------------- MOCK DATA ----------------

const trips = [
    { type: "Bus", price: 1000 },
    { type: "Train", price: 800 },
    { type: "Flight", price: 3000 }
];

// ---------------- SEARCH ----------------

function searchTrips() {

    let source = document.getElementById("source").value;
    let destination = document.getElementById("destination").value;

    let error = document.getElementById("error");

    if (!source || !destination) {

        error.innerText =
            "Please select both source and destination";

        return;
    }

    if (source === destination) {

        error.innerText =
            "Source and Destination cannot be same";

        return;
    }

    error.innerText = "";

    localStorage.setItem(
        "searchData",
        JSON.stringify({ source, destination })
    );

    window.location.href = "results.html";
}

// ---------------- RESULTS PAGE ----------------

if (window.location.pathname.includes("results.html")) {

    let searchData =
        JSON.parse(localStorage.getItem("searchData"));

    if (!searchData) {

        document.body.innerHTML =
            "<h2>No Search Data Found</h2>";

    } else {

        document.getElementById("route").innerText =
            `${searchData.source} → ${searchData.destination}`;

        let list = document.getElementById("list");

        trips.forEach((trip) => {

            let div = document.createElement("div");

            div.className = "trip";

            div.innerHTML = `
                <p>${searchData.source} → ${searchData.destination}</p>

                <p>${trip.type} - Rs. ${trip.price}</p>

                <button onclick="book(${trip.price})">
                    Book
                </button>
            `;

            list.appendChild(div);
        });
    }
}

// ---------------- BOOK ----------------

function book(price) {

    let searchData =
        JSON.parse(localStorage.getItem("searchData"));

    let booking = {

        route:
            `${searchData.source} → ${searchData.destination}`,

        price: price,

        status: "Pending",

        date: new Date().toLocaleString()
    };

    // Existing history
    let history =
        JSON.parse(localStorage.getItem("bookingHistory")) || [];

    history.push(booking);

    localStorage.setItem(
        "bookingHistory",
        JSON.stringify(history)
    );

    localStorage.setItem(
        "latestBooking",
        JSON.stringify(booking)
    );

    window.location.href = "booking.html";
}

// ---------------- BOOKING PAGE ----------------

if (window.location.pathname.includes("booking.html")) {

    let bookingData =
        JSON.parse(localStorage.getItem("latestBooking"));

    if (bookingData) {

        document.getElementById("route").innerText =
            bookingData.route;

        document.getElementById("price").innerText =
            "Price: Rs. " + bookingData.price;
    }
}

// ---------------- CONFIRM BOOKING ----------------

function confirmBooking() {

    let bookingData =
        JSON.parse(localStorage.getItem("latestBooking"));

    bookingData.status = "Confirmed";

    localStorage.setItem(
        "latestBooking",
        JSON.stringify(bookingData)
    );

    let history =
        JSON.parse(localStorage.getItem("bookingHistory")) || [];

    history[history.length - 1] = bookingData;

    localStorage.setItem(
        "bookingHistory",
        JSON.stringify(history)
    );

    document.getElementById("msg").innerText =
        "Booking Confirmed Successfully";

    setTimeout(() => {

        window.location.href = "itinerary.html";

    }, 1000);
}

// ---------------- CANCEL BOOKING ----------------

function cancelBooking() {

    let bookingData =
        JSON.parse(localStorage.getItem("latestBooking"));

    let refund =
        bookingData.price -
        (bookingData.price * 0.1);

    bookingData.status = "Cancelled";

    localStorage.setItem(
        "latestBooking",
        JSON.stringify(bookingData)
    );

    let history =
        JSON.parse(localStorage.getItem("bookingHistory")) || [];

    history[history.length - 1] = bookingData;

    localStorage.setItem(
        "bookingHistory",
        JSON.stringify(history)
    );

    document.getElementById("msg").innerText =
        `Booking Cancelled. Refund Amount: Rs. ${refund}`;

    setTimeout(() => {

        window.location.href = "itinerary.html";

    }, 1000);
}

// ---------------- ITINERARY PAGE ----------------

if (window.location.pathname.includes("itinerary.html")) {

    let bookingData =
        JSON.parse(localStorage.getItem("latestBooking"));

    let history =
        JSON.parse(localStorage.getItem("bookingHistory")) || [];

    if (!bookingData) {

        document.body.innerHTML =
            "<h2>No Booking Data Found</h2>";

    } else {

        document.getElementById("route").innerText =
            bookingData.route;

        document.getElementById("price").innerText =
            "Price: Rs. " + bookingData.price;

        document.getElementById("status").innerText =
            "Status: " + bookingData.status;

        let historyHTML =
            "<h3>Booking History</h3>";

        history.slice().reverse().forEach((b) => {

            historyHTML += `
                <div class="trip">
                    <p>${b.route}</p>
                    <p>Price: Rs. ${b.price}</p>
                    <p>Status: ${b.status}</p>
                    <p>${b.date}</p>
                </div>
            `;
        });

        document.getElementById("history").innerHTML =
            historyHTML;
    }
}
