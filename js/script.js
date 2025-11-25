/* script.js
   Must be loaded via <script defer> in the head of all HTML files.
   Contains:
   - Questions button alert
   - initMap() function used by Google Maps callback
   - locate (geolocation) and click-to-add-marker
*/

/* ---------- Basic DOM-safe operations ---------- */
function safeGet(id) {
  return document.getElementById(id);
}

/* Questions button alert - two lines */
document.addEventListener('DOMContentLoaded', function () {
  // Insert current year into footers if present
  const y = new Date().getFullYear();
  const yearIds = ['year','year-2','year-3','year-map'];
  yearIds.forEach(id => {
    const el = safeGet(id);
    if (el) el.textContent = y;
  });

  const qBtn = safeGet('questionBtn');
  if (qBtn) {
    qBtn.addEventListener('click', function () {
      // Two-line alert (newline character)
      alert("If you have questions, contact me at:\n your-email@example.com");
    });
  }

  const locateBtn = safeGet('locateBtn');
  if (locateBtn) {
    locateBtn.addEventListener('click', function () {
      if (window.map && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
          const latLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          window.map.setCenter(latLng);
          window.map.setZoom(14);
          // put a marker to show the user's location
          new google.maps.Marker({
            position: latLng,
            map: window.map,
            title: "You are here"
          });
        }, function (err) {
          // friendly fallback message
          alert("Could not get your location: " + (err.message || "permission denied"));
        });
      } else {
        alert("Geolocation not supported or the map is not yet ready.");
      }
    });
  }
});

/* ---------- Google Maps: initMap ---------- */
/* This function is referenced by the Google Maps script tag callback parameter.
   It must exist in the global scope. */
function initMap() {
  try {
    // Basic map centered at an example location (e.g., Chicago)
    const center = { lat: 41.8781, lng: -87.6298 };
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: center,
      mapTypeControl: true,       // Feature #1: map type control (MAP, SATELLITE)
      streetViewControl: false
    });

    // Make map global for use by locate button
    window.map = map;

    // Feature #2: Add multiple markers with info windows
    const places = [
      { title: "Location A", position: { lat: 41.885, lng: -87.620 }, content: "Location A: Example info." },
      { title: "Location B", position: { lat: 41.870, lng: -87.650 }, content: "Location B: Example info." },
      { title: "Location C", position: { lat: 41.900, lng: -87.640 }, content: "Location C: Example info." }
    ];

    const infoWindow = new google.maps.InfoWindow();

    places.forEach(p => {
      const marker = new google.maps.Marker({
        position: p.position,
        map: map,
        title: p.title
      });

      marker.addListener('click', function () {
        infoWindow.setContent('<div><strong>' + p.title + '</strong><p>' + p.content + '</p></div>');
        infoWindow.open(map, marker);
      });
    });

    // Feature #3: Click-to-add-marker with lat/lng info window
    map.addListener('click', function (e) {
      const clickedPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      const newMarker = new google.maps.Marker({
        position: clickedPos,
        map: map,
        title: "Custom marker"
      });
      const latLngString = 'Lat: ' + clickedPos.lat.toFixed(6) + ', Lng: ' + clickedPos.lng.toFixed(6);
      const clickInfo = new google.maps.InfoWindow({
        content: '<div><strong>New marker</strong><p>' + latLngString + '</p></div>'
      });
      clickInfo.open(map, newMarker);
    });

  } catch (err) {
    // Ensure no uncaught errors — provide a console-friendly message
    // (console is fine for debugging; this is safe and doesn't throw)
    console.error("Map initialization error:", err);
  }
}

/* Expose initMap in case some loaders require it on the window */
window.initMap = initMap;
