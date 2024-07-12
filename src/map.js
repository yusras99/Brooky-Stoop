document.addEventListener('DOMContentLoaded', function() {
    var map;
    var destination = { lat: 40.681368, lng: -73.996062 }; // 2nd Pl & Court St, Brooklyn coordinates
    var customIcon = '../assets/marker.png'; // Path to custom marker image

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: destination,
            streetViewControl: true, // Enable Street View control
            mapTypeControl: true, // Enable map type control (e.g., satellite view)
        });

        // Add custom marker at the Brooklyn location
        var marker = new google.maps.Marker({
            position: destination,
            map: map,
            title: '2nd Pl & Court St, Brooklyn, NY',
            icon: {
                url: customIcon,
                scaledSize: new google.maps.Size(50, 50), // Adjust size as needed
            }
        });

        map.addListener('click', function() {
            var destinationLatLng = new google.maps.LatLng(destination.lat, destination.lng);
            var googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationLatLng.lat()},${destinationLatLng.lng()}`;
            var appleMapsUrl = `http://maps.apple.com/?daddr=${destinationLatLng.lat()},${destinationLatLng.lng()}`;

            if (confirm("Would you like to get directions in Google Maps?")) {
                window.open(googleMapsUrl, '_blank');
            } else {
                // Do nothing on cancel
            }
        });
        // Add Traffic Layer
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);

        // Add Transit Layer
        var transitLayer = new google.maps.TransitLayer();
        transitLayer.setMap(map);

        
    }

    function loadScript(url) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.body.appendChild(script);
        console.log('Google Maps script loaded');
    }

    window.initMap = initMap;
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyD8BJJj8x4zEwK6k0TpG287fy9-kJetIqE&callback=initMap&libraries=places,directions');
});
