import React from 'react';
import './listEtape.scss';
import {List, Divider, Timeline, Button} from "antd";
import Etape from './Etape';


class ListEtape extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            background: "violet",
            direction: null
        };
        this.getStepToStepDirection = this.getStepToStepDirection.bind(this);
        this.displayDate = this.displayDate.bind(this);
        this.displayDirection = this.displayDirection.bind(this);
        this.groupByDate = this.groupByDate.bind(this);
        
    }

    componentDidMount() {
        console.log("Chargement de la liste etape...");

    }

    groupByDate(list){
    
        var groupedByDate = [];

        for (var i = 0; i < list.length; i++) {
            const goodday = groupedByDate.find((activite) => activite.date.isSame(list[i].date), 'day');
            if (goodday === undefined) {
                groupedByDate.push({ date: list[i].date, activite: [list[i]] });
            } else goodday.activite.push(list[i]);
        };
                
        console.log(groupedByDate);

        return groupedByDate;
    }

    getStepToStepDirection(firstStepKey) {
        const depart = this.props.listV.find((etape) => etape.key === firstStepKey);


        const arrivee = this.props.listV.find((etape) => etape.rank === depart.rank + 1);

        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService();

        directionsService.route({
            origin: {
                placeId: depart.googlePlaceId
            },
            destination: {
                placeId: arrivee.googlePlaceId
            },
            // eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.DRIVING
        }, (result, status) => {
            console.log("Call direction services")
            // eslint-disable-next-line no-undef
            if (status === google.maps.DirectionsStatus.OK) { // On remonte le rendered dans la liste
                this.props.setCalculatedDirection(firstStepKey, result);
            } else {
                console.error(`error fetching directions ${result}`);
            }
        });


    }

    // TODO : Afficher uniquement la premiére occurence de la date
    displayDate(date) {

        return (
            <Timeline.Item key={date.format("YYYYDDMMhhmmss")}  className="timeLineItem label-date">
                {
                date.format("ddd DD/MM")
            } </Timeline.Item>
        );
        /*  if (this.uniqDate.find(d => d === date) === undefined){
          //Nouvelle date
          this.uniqDate.push(date);
          //this.setState({uniqDate : uniqDatelocal})
          return (
              <Timeline.Item className="timeLineItem label-date">
                  {
                  date.format("ddd DD/MM")
              } </Timeline.Item>
          );
        }else{
          //La date est déja affiché on ne met rien
          return("");
        } */

    }

    displayDirection(direction) {

        if (direction !== undefined && direction !== null) {
            return (
                <Timeline.Item key={direction.geocoded_waypoints[0].place_id} className="timeLineItem label-date">Direction : {direction.geocoded_waypoints[0].place_id}</Timeline.Item>
            );
        }
    }

    render() {
        return (
            <div className="list-etape-main">
                <Divider orientation="left">Liste des étapes</Divider>
                <Timeline mode="left">
                    <List split={false}
                        dataSource={this.groupByDate(this.props.listV)}
                        rowKey={
                            (item) => item.date
                        }
                        renderItem={
                            (item) => (
                               <div key={item.date}>
                                    {
                                        this.displayDate(item.date)
                                    }
                                    
                                    <Timeline.Item key={item.date}
                                        className="timeLineItem etape">

                                        <Etape data={item.activite}
                                            cbBg={
                                                this.props.selectEtape
                                            }
                                            getStepToStepDirection={
                                                this.getStepToStepDirection
                                            }
                                            deleteActivity={this.props.deleteActivity}/>

                                    </Timeline.Item>
                                    
                                </div>
                            )
                        }/>

                </Timeline>

        </div>
        );
    }
}


export default ListEtape;
