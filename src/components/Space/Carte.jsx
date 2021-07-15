import React from 'react';
import Marker from './Marker'
import Polyline from './Polyline'
import GoogleMapReact from 'google-map-react'; //https://github.com/google-map-react/google-map-react
//import decodePolyline from "decode-google-map-polyline";
//UNINSTZALL import { DirectionsRenderer } from "react-google-maps";
import shouldPureComponentUpdate from 'react-pure-render/function';

const decodePolyline = require("decode-google-map-polyline");

class Carte extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      mapsLoaded: false,
      map: null,
      maps: null,
      GMAPS_API_KEY: "AIzaSyCsEisE6ttI_E8imbal3A4PdXJkLf9a0zc",
    };
  }

  onMapLoaded(map, maps) {
    this.fitBounds(map, maps);

    this.setState({
      // Je commente car je sais pas à quoi ca sert:
      // ...this.state,
      mapsLoaded: true,
      map: map,
      maps: maps,
    });
  }

  fitBounds(map, maps) {
    var bounds = new maps.LatLngBounds();
    for (let place of this.props.activitiesList) {
      bounds.extend(new maps.LatLng(place.lat, place.long));
    }
    map.fitBounds(bounds);
  }

  _onClick({ x, y, lat, lng, event }) {
    console.log(x, y, lat, lng, event);
  }

  //FIXME : Attention la méthode est appelée 2x
  loadDirectionsOnMap(directionsResult, key) {
    const path = decodePolyline(directionsResult.routes[0].overview_polyline);
    console.log("Draw Polyline: " + key);
       
    if (this.props.focusOnPolylineId === key) {
      console.log("Focus on plyline : " + key);
      const bounds = new window.google.maps.LatLngBounds();
      path.map((x) => {
        bounds.extend(new window.google.maps.LatLng(x.lat, x.lng));
        return "";
      }); 
      this.state.map && this.state.map.fitBounds(bounds);
    }
    return <Polyline key={key} map={this.state.map} maps={this.state.maps} path={path} />;
  }

  onMapChange() {
    console.log("MAP mise à jours");
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "90vh", width: "100%" }}>
        <GoogleMapReact
          key={this.props.mapKey}
          bootstrapURLKeys={{
            key: this.state.GOOGLE_MAPS_API,
            language: "fr",
            region: "fr_FR",
          }}
          center={this.props.center}
          zoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals={true}
          onGoogleApiLoaded={({ map, maps }) => this.onMapLoaded(map, maps)}
          onChange={this.onMapChange()}
          onBoundsChange={this._onBoundsChange}
          onChildClick={this._onChildClick}
          onChildMouseEnter={this._onChildMouseEnter}
          onChildMouseLeave={this._onChildMouseLeave}
        >
          {this.props.activitiesList.map((place) => (
            <Marker
              key={place.key}
              lat={place.lat}
              lng={place.long}
              text={place.key + ""}
              isActive={place.selected}
            />
          ))}
          {/* Comment tout mettre dans une seul boucle ? */}
          {this.props.activitiesList
            .filter((place) => place.directionsResult !== undefined && place.directionsResult !== null)
            .map((place) => this.loadDirectionsOnMap(place.directionsResult, place.key))}
        </GoogleMapReact>
      </div>
    );
  }
}
export default Carte
