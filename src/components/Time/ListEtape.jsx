import React from 'react';
import './listEtape.scss';
import StepFinder from './Stepfinder';
import {List, Divider, Timeline, Button} from "antd";
import Etape from './Etape';


class ListEtape extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            background: "violet",
            direction: null,
            modalVisible : false,
            modalEtapeDay : null,
            modalTimeOfDay : null,

        };
        this.getStepToStepDirection = this.getStepToStepDirection.bind(this);
        this.displayDate = this.displayDate.bind(this);
        this.groupByDate = this.groupByDate.bind(this);
        this.showModal = this.showModal.bind(this);
        
    }

    componentDidMount() {
        console.log("Chargement de la liste etape...");

    }

    groupByDate(list){
    
        var groupedByDate = [];

        for (var i = 0; i < list.length; i++) {
            const goodday = groupedByDate.find((activities) => activities.etapeDay.isSame(list[i].date, 'day'));
            if (goodday === undefined) {
                groupedByDate.push({ etapeDay: list[i].date, activities: [list[i]] });
            } else goodday.activities.push(list[i]);
        };
                
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

    }

    showModal(etapeDay, timeOfDay){
        this.setState({
            modalVisible : true, 
            modalEtapeDay : etapeDay,
            modalTimeOfDay : timeOfDay})
    }
    
    closeModal = () => {
        this.setState({ modalVisible : false ,
                        modalEtapeDay : null,
                        modalTimeOfDay : null});
    }

    render() {
        return (
            <div>
                {this.state.modalVisible ?(
                    <div className="StepFinder">
                        <StepFinder  
                                    showModal={this.showModal}
                                    closeModal={this.closeModal}
                                    etapeDay={this.state.modalEtapeDay} 
                                    timeOfDay={this.state.modalTimeOfDay} 
                                    addEtape={this.props.addEtape}  />
                    </div>) : ''
                }
                <div className="list-etape-main">
                    
                    <Divider orientation="left">Liste des étapes</Divider>
                    <Timeline mode="left">
                        <List split={false}
                            dataSource={this.groupByDate(this.props.listV)}
                            rowKey={
                                (item) => item.etapeDay
                            }
                            renderItem={
                                (item) => (
                                <div key={item.etapeDay.format()}>
                                        {this.displayDate(item.etapeDay)}
                                        <Timeline.Item key={item.etapeDay} className="timeLineItem etape">
                                            <Etape 
                                                data={item}
                                                cbBg={this.props.selectEtape}
                                                getStepToStepDirection={this.getStepToStepDirection}
                                                showModal={this.showModal}
                                                deleteActivity={this.props.deleteActivity}
                                            />
                                        </Timeline.Item>
                                        
                                    </div>
                                )
                            }/>

                    </Timeline>

            </div>
        </div>
        );
    }
}


export default ListEtape;
