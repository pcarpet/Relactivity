import React from 'react';
import './listEtape.scss';
import { List, Divider } from "antd";
import Etape from './Etape';
 

class ListEtape extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
      background: "violet",
      direction : null,
    };
    this.getStepToStepDirection = this.getStepToStepDirection.bind(this);
	}


  getStepToStepDirection(firstStepKey) {
    console.log("Item Id:" + firstStepKey);
    const depart = this.props.listV.find((etape) => etape.key === firstStepKey);

    console.log(
      "Départ Googe PlaceId:" +
        depart.googlePlaceId +
        "Départ rank:" +
        depart.rank
    );

    const arrivee = this.props.listV.find(
      (etape) => etape.rank === depart.rank + 1
    );

    console.log("Arrivée placeId: " + arrivee.placeId);

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
   
    directionsService.route(
      {
        origin: { placeId: depart.googlePlaceId },
        destination: { placeId: arrivee.googlePlaceId },
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        // eslint-disable-next-line no-undef
        if (status === google.maps.DirectionsStatus.OK) {
          console.log(result);
          //On remonte le rendered dans la liste
          this.props.setCalculatedDirection(firstStepKey, result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );


  }
	
	render() {
    return (
      <div className="list-etape-main">
        <Divider orientation="left">Liste des étapes</Divider>
        <List
          split={false}
          dataSource={this.props.listV}
          rowKey={(item, index) => index}
          renderItem={(item) => (
            <List.Item className="etape">
              <Etape
                data={item}
                cbBg={this.props.selectEtape}
                getStepToStepDirection={this.getStepToStepDirection}
              />
            </List.Item>
          )}
        />
      </div>
    );
	}
}



export default ListEtape;

