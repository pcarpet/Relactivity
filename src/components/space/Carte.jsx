import React, { useRef, useEffect } from 'react';//TODO : Loader l'api mieu : https://developers.google.com/maps/documentation/javascript/overview?hl=fr#js_api_loader_package
const decodePolyline = require("decode-google-map-polyline");

export default function Carte({activitiesList, displayPoiData}) {
    
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  

  useEffect(() => {
      

    // Initialize the map
    const map = new window.google.maps.Map(mapRef.current);

    // Create a PlacesService to get details about the clicked location
    const placesService = new window.google.maps.places.PlacesService(map);

    var infowindow = new window.google.maps.InfoWindow();

    // Add a click event listener to the map
    map.addListener('click', (event) => {
        // Get clicked location's latitude and longitude
        const clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };

        console.log('Is POI:', "placeId" in event)
        if("placeId" in event){
            console.log(event)
            event.stop(); //https://stackoverflow.com/questions/61294586/how-can-you-customize-the-contents-of-popups-when-you-click-on-built-in-location/61310243#61310243
            infowindow.close();

            // Use the PlacesService to get details for the clicked location
            placesService.getDetails({ placeId: event.placeId }, (place, status) => {
            if (status === 'OK') {
                // Log the detailed information (you can use it as needed)
                console.log('Clicked Location:', clickedLocation);
                console.log('Place Details:', place);
                displayPoiData(place);
            } else {
                console.error('PlacesService failed due to:', status);
            }
            });
        }




    });

    // Loop through the marker data and create markers
    activitiesList.forEach((activity) => {
        const marker = new window.google.maps.Marker({
            position: {lat: activity.origin.lat, lng: activity.origin.long},
            map: map,
            title: activity.nomEtape
        });
        
        // Save the marker to the array for future reference or updates
        markersRef.current.push(marker);
    });


    //création des Polyline
    for(const activityRoute of activitiesList.filter(act => act.route !== undefined && act.route !== null)){
        console.log(activityRoute) 
        console.log("Création d'un nouveau polyline")
        let path = decodePolyline(activityRoute.route.routes[0].overview_polyline);
        let nonGeodesicPolyline = new window.google.maps.Polyline({
            path: path,
            geodesic: false,//rendering non geodesic polyline (straight line)
            strokeColor: '#0000f0e4',
            strokeOpacity: 0.7,
            strokeWeight: 3
          });
        nonGeodesicPolyline.setMap(map)
    }



    //Fit bounds to the markers or la France
    map.fitBounds(fitMyBounds(activitiesList));

    // You can, polygons, etc. here

  }, [activitiesList, displayPoiData]); // Run this effect only once on component mount


  function fitMyBounds(activities) {
    var bounds = new window.google.maps.LatLngBounds();
    if(activities.length ===0){
      // C'est la FRANCE monsieur
      let initMapsZone = [{lat: 50.802448,long:-4.947507},
                          {lat: 42.559802,long:-4.947507},
                          {lat: 50.802448,long:8.432071197773451},
                          {lat: 42.559802,long:8.432071197773451}]
      for (let place of initMapsZone) {
        bounds.extend(new window.google.maps.LatLng(place.lat, place.long));
      }
    }else{
      //Si il y a une activité sélectioné on zoom dessus desactivé pour le moment
     /* if(activities.find(a => a.selected) !== undefined){
        activities = activities.filter(a => a.selected);
      }  */

      for (let place of activities) {
        bounds.extend(new window.google.maps.LatLng(place.origin.lat, place.origin.long));
      }
    }
    return bounds;
  }

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

