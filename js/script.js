function safeGet(id) { return document.getElementById(id); }

document.addEventListener('DOMContentLoaded', function () {
  const qBtn = safeGet('questionBtn');
  if (qBtn) {
    qBtn.addEventListener('click', function () {
      alert("If you have questions, contact me at:\nasingh195@hawk.illinoistech.edu");
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
          new google.maps.Marker({ position: latLng, map: window.map, title: "You are here" });
        }, function (err) {
          alert("Could not get your location: " + (err.message || "permission denied"));
        });
      } else {
        alert("Geolocation not supported or the map is not ready.");
      }
    });
  }
});

function initMap() {
  const center = { lat: 41.8781, lng: -87.6298 };
  const map = new google.maps.Map(document.getElementById('map'), { zoom: 10, center, mapTypeControl: true, streetViewControl: false });
  window.map = map;

  const places = [
    { title: "Location A", position: { lat: 41.885, lng: -87.620 }, content: "Location A: Example info." },
    { title: "Location B", position: { lat: 41.870, lng: -87.650 }, content: "Location B: Example info." },
    { title: "Location C", position: { lat: 41.900, lng: -87.640 }, content: "Location C: Example info." }
  ];

  const infoWindow = new google.maps.InfoWindow();
  places.forEach(p => {
    const marker = new google.maps.Marker({ position: p.position, map, title: p.title });
    marker.addListener('click', () => {
      infoWindow.setContent('<div><strong>' + p.title + '</strong><p>' + p.content + '</p></div>');
      infoWindow.open(map, marker);
    });
  });

  map.addListener('click', function (e) {
    const clickedPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    const newMarker = new google.maps.Marker({ position: clickedPos, map, title: "Custom marker" });
    const clickInfo = new google.maps.InfoWindow({ content: `<div><strong>New marker</strong><p>Lat: ${clickedPos.lat.toFixed(6)}, Lng: ${clickedPos.lng.toFixed(6)}</p></div>` });
    clickInfo.open(map, newMarker);
  });
}

window.initMap = initMap;
