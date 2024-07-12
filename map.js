document.addEventListener('DOMContentLoaded', function() {
    var map;
    var directionsService;
    var directionsRenderer;
    var autocomplete;

    // Initialize map
    function initMap() {
        var brooklynLocation = { lat: 40.681368, lng: -73.996062 }; // 2nd Pl & Court St, Brooklyn coordinates
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: brooklynLocation
        });

        // Add marker at the Brooklyn location
        var marker = new google.maps.Marker({
            position: brooklynLocation,
            map: map,
            title: '2nd Pl & Court St, Brooklyn, NY'
        });

        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        // Initialize autocomplete
        var input = document.getElementById('user-address');
        autocomplete = new google.maps.places.Autocomplete(input);
    }

    // Load Google Maps script dynamically
    function loadScript(url) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.body.appendChild(script);
        console.log('Google Maps script loaded');
    }

    window.initMap = initMap;
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyD8BJJj8x4zEwK6k0TpG287fy9-kJetIqE&callback=initMap&libraries=places,directions');

    // Calculate route from user address to Brooklyn location
    document.getElementById('check-route').addEventListener('click', function() {
        var userAddress = document.getElementById('user-address').value;
        var travelMode = document.getElementById('travel-mode').value;
        calculateRoute(userAddress, { lat: 40.681368, lng: -73.996062 }, travelMode);
    });

    function calculateRoute(origin, destination, travelMode) {
        var request = {
            origin: origin,
            destination: destination,
            travelMode: travelMode
        };
        directionsService.route(request, function(result, status) {
            if (status == 'OK') {
                directionsRenderer.setDirections(result);
                displayTravelInfo(result);
            } else {
                alert('Directions request failed due to ' + status);
            }
        });
    }

    function displayTravelInfo(result) {
        var leg = result.routes[0].legs[0];
        var travelInfo = 'Estimated travel time: ' + leg.duration.text + ' (' + leg.distance.text + ')';
        document.getElementById('travel-info').innerText = travelInfo;
    }
});
