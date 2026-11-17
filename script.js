  
(function () {
  "use strict";

  var CONTACT_EMAIL = "azaremba1@hawk.illinoistech.edu";

  // Places shown on the map might be a bit off
  var PLACES = [
    {
      id: "IIT",
      name: "Illinois Institute of Technology",
      detail: "Where I am working on my Bachelor's in Information Technology and Management.",
      position: { lat: 41.8349, lng: -87.6270 }
    },
    {
      id: "MVCC",
      name: "Moraine Valley Community College",
      detail: "Where I earned my Associate's in General Studies.",
      position: { lat: 41.7010, lng: -87.8330 }
    },
    {
      id: "RHS",
      name: "Reavis High School",
      detail: "Where I started swimming competitively my senior year.",
      position: { lat: 41.7447, lng: -87.7836 }
    }
  ];

  var map = null;
  var infoWindow = null;
  var placeMarkers = {};   // pins for the PLACES above, keyed by id
  var userMarkers = [];    // pins the visitor drops by clicking the map

  function byId(id) {
    return document.getElementById(id);
  }

  function setStatus(message) {
    var status = byId("mapStatus");
    if (status) {
      status.textContent = message;
    }
  }

  function buildInfoContent(title, text) {
    var wrapper = document.createElement("div");
    wrapper.className = "info";
    var heading = document.createElement("h3");
    heading.textContent = title;
    var body = document.createElement("p");
    body.textContent = text;
    wrapper.appendChild(heading);
    wrapper.appendChild(body);
    return wrapper;
  }

  function openInfo(marker, title, text) {
    infoWindow.setContent(buildInfoContent(title, text));
    infoWindow.open({ map: map, anchor: marker });
  }

  //  pins with info windows 
  function addPlaceMarkers() {
    PLACES.forEach(function (place) {
      var marker = new google.maps.Marker({
        position: place.position,
        map: map,
        title: place.name
      });
      marker.addListener("click", function () {
        openInfo(marker, place.name, place.detail);
      });
      placeMarkers[place.id] = marker;
    });
  }

  // Map feature 2: click the map to drop your own pin   
  function enableClickToAddMarkers() {
    map.addListener("click", function (event) {
      var count = userMarkers.length + 1;
      var marker = new google.maps.Marker({
        position: event.latLng,
        map: map,
        label: String(count),
        title: "My pin " + count
      });
      marker.addListener("click", function () {
        openInfo(
          marker,
          "My pin " + count,
          "Latitude " + event.latLng.lat().toFixed(4) +
            ", longitude " + event.latLng.lng().toFixed(4)
        );
      });
      userMarkers.push(marker);
    });
  }

  function clearUserMarkers() {
    userMarkers.forEach(function (marker) {
      marker.setMap(null);
    });
    userMarkers = [];
    if (infoWindow) {
      infoWindow.close();
    }
  }

  // this is the list that takes you directly to the places that are already pinned
  function fillPlaceSelect() {
    var select = byId("placeSelect");
    if (!select) {
      return;
    }
    PLACES.forEach(function (place) {
      var option = document.createElement("option");
      option.value = place.id;
      option.textContent = place.name;
      select.appendChild(option);
    });
  }

  function goToPlace(id) {
    var place = PLACES.filter(function (p) { return p.id === id; })[0];
    if (!place || !map) {
      return;
    }
    map.panTo(place.position);
    map.setZoom(15);
    openInfo(placeMarkers[place.id], place.name, place.detail);
  }

  // Google maps calls this 
  function initMap() {
    var mapDiv = byId("map");
    if (!mapDiv || typeof google === "undefined" || !google.maps) {
      return;
    }

    map = new google.maps.Map(mapDiv, {
      center: { lat: 41.78, lng: -87.73 },
      zoom: 10,
      mapTypeControl: true,
      fullscreenControl: true
    });
    infoWindow = new google.maps.InfoWindow();

    addPlaceMarkers();
    enableClickToAddMarkers();
    setStatus("Map loaded. Click a pin, or click the map to add your own.");
  }

  // just in case the API key does not work
  function handleAuthFailure() {
    setStatus("The map could not load. Please check the Google Maps API key.");
  }

  // Once Html is ready
  function setUpPage() {
    // Questions button to contact my email
    var questionsBtn = byId("questionsBtn");
    if (questionsBtn) {
      questionsBtn.addEventListener("click", function () {
        alert("If you have questions, contact me at:\n" + CONTACT_EMAIL);
      });
    }

    var clearBtn = byId("clearBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", clearUserMarkers);
    }

    var select = byId("placeSelect");
    if (select) {
      fillPlaceSelect();
      select.addEventListener("change", function () {
        goToPlace(select.value);
      });
    }
  }

  window.initMap = initMap;
  window.gm_authFailure = handleAuthFailure;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setUpPage);
  } else {
    setUpPage();
  }
})();
