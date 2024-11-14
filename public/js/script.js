// Initialize a WebSocket connection to the server
const socket = io();

// Check if the browser supports geolocation
if (navigator.geolocation) {
    // Watch the user's position, triggering the callback whenever it changes
    navigator.geolocation.watchPosition((position) => {
        // Extract latitude and longitude from the geolocation API
        const { latitude, longitude } = position.coords;

        // Send the location to the server over WebSocket
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        // Log any errors encountered with geolocation
        console.error(error);
    },
        {
            // Geolocation options: enable high accuracy, set a timeout, and no caching
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

// Initialize a Leaflet map centered at a default location
const map = L.map("map").setView([0, 0], 10);

// Use OpenStreetMap tiles for the map and add an attribution
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Prabhat Map"
}).addTo(map);

// Initialize an object to store markers for each user by their unique socket ID
const marker = {};

// Listen for location data from other clients
socket.on("receive-location", (data) => {
    // Extract the user ID, latitude, and longitude from the received data
    const { id, latitude, longitude } = data;

    // Center the map on the received location, zooming in to level 16
    map.setView([latitude, longitude], 16);

    // Check if a marker already exists for the user
    if (marker[id]) {
        // Update the position of the existing marker
        marker[id].setLatLng([latitude, longitude]);
    } else {
        // Create a new marker for this user and add it to the map
        marker[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// Listen for the 'user-disconnected' event from the server
socket.on("user-disconnected", function (id) {
    // Check if the disconnected user has an associated marker
    if (marker[id]) {
        // Remove the marker from the map and delete it from the markers object
        map.removeLayer(marker[id]);
        delete marker[id];
    }
});
