import React from 'react';
import GoogleMapReact from 'google-map-react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 15px;
  height: 15px;
  background-color: #FF6600;
  border: 2px solid #fff;
  border-radius: 100%;
  user-select: none;
  font-weight:bold;
  padding-top:2px;
  font-size:10px;
  color:white;
  transform: translate(-50%, -50%);
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  &:hover {
    z-index: 1;
  }
`;



class Carte extends React.Component {
	
	constructor(props) {
		super(props);
		this.props=props;
		this.state = {
      GMAPS_API_KEY: {
        key: "AIzaSyCsEisE6ttI_E8imbal3A4PdXJkLf9a0zc",
        language: "fr",
      },
      places: this.props.list,
    };
    
	}

	
	/*
	
	handleGoogleMapApi (map, google) {
	    
	    const drawingManager = google.maps.drawing.DrawingManager({
	      drawingMode: google.maps.drawing.OverlayType.MARKER,
	      drawingControl: true,
	      drawingControlOptions: {
	        position: google.maps.ControlPosition.TOP_CENTER,
	        drawingModes: [
	          google.maps.drawing.OverlayType.MARKER,
	          google.maps.drawing.OverlayType.CIRCLE,
	          google.maps.drawing.OverlayType.POLYGON,
	          google.maps.drawing.OverlayType.POLYLINE,
	          google.maps.drawing.OverlayType.RECTANGLE
	        ]
	      },
	      markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
	      circleOptions: {
	        fillColor: '#ffff00',
	        fillOpacity: 1,
	        strokeWeight: 5,
	        clickable: false,
	        editable: true,
	        zIndex: 1
	      }
	    });
	    drawingManager.setMap(map);
	  }
	 onGoogleApiLoaded={ this.handleGoogleMapApi.bind(this)}
	*/
	
	_onClick ({x, y, lat, lng, event}){
		console.log(x, y, lat, lng, event)
	} 
    
	shouldComponentUpdate = shouldPureComponentUpdate;
 
     render() {
       return (
         // Important! Always set the container height explicitly
         <div style={{ height: "90vh", width: "100%" }}>
           {/* <Text>
             Position: {this.props.center[0]} , {this.props.center[1]}{" "}
           </Text>
           <Text>Zoom: {this.props.zoom} </Text> */}
           <GoogleMapReact
             bootstrapURLKeys={this.state.GOOGLE_MAPS_API}
             center={this.props.center}
             zoom={this.props.zoom}
             /* yesIWantToUseGoogleMapApiInternals */

             onBoundsChange={this._onBoundsChange}
             onChildClick={this._onChildClick}
             onChildMouseEnter={this._onChildMouseEnter}
             onChildMouseLeave={this._onChildMouseLeave}
             onClick={this._onClick}
           >
             {this.state.places.map((place) => (
               <Wrapper
                 key={place.id}
                 lat={place.lat}
                 lng={place.long}
               >

                 {place.date.format("ddd DD")}
               </Wrapper>
             ))}
           </GoogleMapReact>
         </div>
       );
     }
}
export default Carte
