import React, { useRef, useEffect } from 'react';//TODO : Loader l'api mieu : https://developers.google.com/maps/documentation/javascript/overview?hl=fr#js_api_loader_package
import './carte.css'
const decodePolyline = require("decode-google-map-polyline");

export default function Carte({ activitiesList, displayPoiData }) {

    const mapRef = useRef(null);
    //const markersRef = useRef([]);


    useEffect(() => {
        console.log("Reinitialisaiton de la ma. MapRef: ", mapRef);

        // Initialize the map
        const map = new window.google.maps.Map(mapRef.current, {
            mapId: 'e8fbc944e4790e01'
        });

        var infowindow = new window.google.maps.InfoWindow();
        
        // Add a click event listener to the map
        map.addListener('click', (event) => {
            if ("placeId" in event) {
                console.log(event)
                event.stop(); //https://stackoverflow.com/questions/61294586/how-can-you-customize-the-contents-of-popups-when-you-click-on-built-in-location/61310243#61310243
                infowindow.close();
                
                // Create a PlacesService to get details about the clicked location
                const placesService = new window.google.maps.places.PlacesService(map);
                // Use the PlacesService to get details for the clicked location
                placesService.getDetails({ placeId: event.placeId }, (place, status) => {
                    if (status === 'OK') {
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

            const color = getPinDayColor(activity.startDate.day());
            const pinView = new window.google.maps.marker.PinView({
                borderColor: color,
                background: color,
                glyphColor: "white"
              });

            const AdvancedMarkerElement = new window.google.maps.marker.AdvancedMarkerElement({
                position: { lat: activity.origin.lat, lng: activity.origin.long },
                map: map,
                title: activity.nomEtape,
                content: pinView.element,
            });

            AdvancedMarkerElement.addListener("click", () => {
                toggleHighlight(AdvancedMarkerElement, activity);
              });
      
        });


        //création des Polyline
        for (const activityRoute of activitiesList.filter(act => act.route !== undefined && act.route !== null)) {
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

        return () => {
            //TODO: Je dois certainement cleaner des trucs mais je ne sais pas quoi....
        };
        //il m'emmerde avec son callback, apparement c'est que pour de l'optim...
        // eslint-disable-next-line 
    }, [activitiesList]); // Run this effect only once on component mount


    function fitMyBounds(activities) {
        var bounds = new window.google.maps.LatLngBounds();
        if (activities.length === 0) {
            // C'est la FRANCE monsieur
            let initMapsZone = [{ lat: 50.802448, long: -4.947507 },
            { lat: 42.559802, long: -4.947507 },
            { lat: 50.802448, long: 8.432071197773451 },
            { lat: 42.559802, long: 8.432071197773451 }]
            for (let place of initMapsZone) {
                bounds.extend(new window.google.maps.LatLng(place.lat, place.long));
            }
        } else {
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

    function toggleHighlight(markerView, activity) {
        console.log('Click on marker')
    }

    function getPinDayColor(day){
        switch(day){
            case 1 : //Lundi
                return '#1abc9c';
            case 2 : //Mardi
                return '#3498db';
            case 3 : //Mercredi
                return '#9b59b6';
            case 4 : //Jeudi
                return '#f1c40f';
            case 5 : //Vendredi
                return '#e67e22';
            case 6 : //Samedi
                return '#e74c3c';
            case 0 : //Dimanche
                return '#2c3e50';
            default :
                console.error("Le jour n'existe pas");
        }
    }
      

    return <div ref={mapRef} style={{ width: '100%', height: '75vh' }} />;
};

