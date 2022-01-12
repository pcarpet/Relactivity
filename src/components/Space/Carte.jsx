import React from 'react';
import Marker from './Marker'
import Polyline from './Polyline'
import GoogleMapReact from 'google-map-react'; //https://github.com/google-map-react/google-map-react
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

    console.log("Map loaded");

    this.setState({
      // Je commente car je sais pas à quoi ca sert:
      // ...this.state,
      mapsLoaded: true,
      map: map,
      maps: maps,
    });
  }

  fitBounds(map, maps) {

    if (maps === undefined || maps == null) { return;}

    var bounds = new maps.LatLngBounds();
    if(this.props.activitiesList.length ===0){
      let initMapsZone = [{lat: 50.802448,long:-4.947507},
                          {lat: 42.559802,long:-4.947507},
                          {lat: 50.802448,long:8.432071197773451},
                          {lat: 42.559802,long:8.432071197773451}]
      for (let place of initMapsZone) {
        bounds.extend(new maps.LatLng(place.lat, place.long));
      }
    }else{
      for (let place of this.props.activitiesList) {
        bounds.extend(new maps.LatLng(place.origin.lat, place.origin.long));
      }
    }
    map.fitBounds(bounds);
  }

  _onClick({ x, y, lat, lng, event }) {
    console.log(x, y, lat, lng, event);
  }


  displayActivitiesOnMap(place){

      return (
          <Marker 
              key={place.key} 
              lat={place.origin.lat} lng={place.origin.long}
              text={place.key + ""}
              isActive={place.selected}
            />
      )

  }

  //FIXME : Attention la méthode est appelée 2x
  //FIXME  les polylines créés ne sont pas supprimé
  displayDirectionsOnMap(route) {

    if(route !== undefined && route !== null){
    const key = route.geocoded_waypoints[0].place_id + route.geocoded_waypoints[1].place_id
    const path = decodePolyline(route.routes[0].overview_polyline);
    console.log("Draw Polyline: " + key);
    return <Polyline key={key} map={this.state.map} maps={this.state.maps} path={path} />;
    }

    return '';

  }

  onMapChange() {
    console.log("MAP mise à jours");
    this.fitBounds(this.state.map, this.state.maps);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "85vh", width: "100%" }}>
        <GoogleMapReact
          //key={this.props.mapKey}
          bootstrapURLKeys={{
            key: this.state.GOOGLE_MAPS_API,
            language: "fr",
            region: "fr_FR",
          }}
          center={[48.85, 2.33]}
          zoom={11}
          yesIWantToUseGoogleMapApiInternals={true}
          onGoogleApiLoaded={({ map, maps }) => this.onMapLoaded(map, maps)}
          onChange={this.onMapChange()}
          onBoundsChange={this._onBoundsChange}
          onChildClick={this._onChildClick}
          onChildMouseEnter={this._onChildMouseEnter}
          onChildMouseLeave={this._onChildMouseLeave}
        >
          {this.props.activitiesList.map(place => this.displayActivitiesOnMap(place))}
          {this.props.activitiesList.map(place => this.displayDirectionsOnMap(place.route))}
        </GoogleMapReact>
      </div>
    );
  }
}
export default Carte
