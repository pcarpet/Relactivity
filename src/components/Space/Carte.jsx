import React from 'react';
import Marker from '../Marker'
import Polyline from './Polyline'
import GoogleMapReact from 'google-map-react'; //https://github.com/google-map-react/google-map-react
import shouldPureComponentUpdate from 'react-pure-render/function';


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
      // Je commente car je sais pas à quoi ca sert
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

  afterMapLoadChanges() {

    return (
      <Polyline
          map={this.state.map}
          maps={this.state.maps}
        /> 
    );
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "90vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: this.state.GOOGLE_MAPS_API,
            language: "fr",
            region: "fr_FR",
          }}
          center={this.props.center}
          zoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals={true}
          onGoogleApiLoaded={({ map, maps }) => this.onMapLoaded(map, maps)}
          onBoundsChange={this._onBoundsChange}
          onChildClick={this._onChildClick}
          onChildMouseEnter={this._onChildMouseEnter}
          onChildMouseLeave={this._onChildMouseLeave}
        >
          {this.props.activitiesList.map((place) => (
            <Marker
              key={place.id}
              lat={place.lat}
              lng={place.long}
              text={place.id + ""}
              isActive={place.selected}
            />
          ))}
          {this.state.mapsLoaded ? this.afterMapLoadChanges() : ""}
        </GoogleMapReact>
      </div>
    );
  }
}
export default Carte
