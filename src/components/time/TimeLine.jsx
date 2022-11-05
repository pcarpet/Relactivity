import React from 'react';
import './timeLine.css';
import StepFinder from './finder/Stepfinder';
import DirectionFinder from './finder/DirectionFinder';
import {List, Divider, Timeline} from "antd";
import EtapeDay from './EtapeDay';


class TimeLine extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            background: "violet",
            modalStepData :{
                isModify : false,
                isVisible : false,
                etapeDay : null,
                timeOfDay : null,
                activityToModify : null,
            },
            modalDirectionData :{
                isModify : false,
                isVisible : false,
                etapeDay : null,
                timeOfDay : null,
                activityToModify : null,
            }

        };
        this.displayDate = this.displayDate.bind(this);
        this.groupByDate = this.groupByDate.bind(this);
        this.showStepModal = this.showStepModal.bind(this);
        this.showDirectionModal = this.showDirectionModal.bind(this);
        this.modifyActivity = this.modifyActivity.bind(this);
        this.modifyDirection = this.modifyDirection.bind(this);
        
    }

    componentDidMount() {
        console.log("Chargement de la liste etape...");

    }

    groupByDate(activities){
    
        var groupedByDate = [];
        
        for (let i = 0; i < activities.length; i++) {
            const goodday = groupedByDate.find((a) => a.etapeDay.isSame(activities[i].date, 'day'));
            if (goodday === undefined) {
                groupedByDate.push({ etapeDay: activities[i].date, activities: [activities[i]] });
            } else goodday.activities.push(activities[i]);
        };
                
        return groupedByDate;
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

    showStepModal(etapeDay, timeOfDay){
        this.setState({modalStepData : {
                            isModify : false,
                            isVisible : true, 
                            etapeDay : etapeDay,
                            timeOfDay : timeOfDay,
                            activityToModify : null,
                        }})
    }

    showDirectionModal(etapeDay, timeOfDay){
        this.setState({modalDirectionData : {
                            isModify : false,
                            isVisible : true, 
                            etapeDay : etapeDay,
                            timeOfDay : timeOfDay,
                            activityToModify : null,
                        }})
    }
    
    closeStepModal = () => {
        this.setState({modalStepData : { 
                        modalVisible : false ,
                        etapeDay : null,
                        timeOfDay : null,
                        activityToModify : null,
                    }});
    }

    closeDirectionModal = () => {
        this.setState({modalDirectionData : { 
                        modalVisible : false ,
                        etapeDay : null,
                        timeOfDay : null,
                        activityToModify : null,
                    }});
    }

    modifyActivity(key){
        const activity = this.props.activities.find((a) => key === a.key);
        
        this.setState({modalStepData : { 
                                isVisible : true ,
                                isModify : true,
                                etapeDay : activity.date,
                                timeOfDay : activity.activityType,
                                activityToModify : activity,
                            }});
    }
    
    modifyDirection(key){
        const activity = this.props.activities.find((a) => key === a.key);
        
        this.setState({modalDirectionData : { 
                                isVisible : true ,
                                isModify : true,
                                etapeDay : activity.date,
                                timeOfDay : activity.activityType,
                                activityToModify : activity,
                            }});
    }
    
    render() {
        return (
            <div>
                {this.state.modalStepData.isVisible ? (
                    <div className="StepFinder">
                        <StepFinder  
                                    closeModal={this.closeStepModal}
                                    modalData={this.state.modalStepData} 
                                    addEtape={this.props.addEtape}
                                    deleteActivityByDateAndType={this.props.deleteActivityByDateAndType}  />
                    </div>) : ''
                }
                {this.state.modalDirectionData.isVisible ?(
                    <div className="StepFinder">
                        <DirectionFinder 
                                    closeModal={this.closeDirectionModal}
                                    modalData={this.state.modalDirectionData} 
                                    addEtape={this.props.addEtape}  />
                    </div>) : ''
                }
                <div className="list-etape-main">
                    
                    <Divider orientation="left">Liste des étapes</Divider>
                    <Timeline mode="left">
                        <List split={false}
                            dataSource={this.groupByDate(this.props.activities)}
                            locale={{emptyText: 'Veuillez saisir les dates de votre trip'}}
                            rowKey={
                                (item) => item.etapeDay
                            }
                            renderItem={
                                (item) => (
                                <div key={item.etapeDay.format()}>
                                        {this.displayDate(item.etapeDay)}
                                        <Timeline.Item key={item.etapeDay} className="timeLineItem etape">
                                            <EtapeDay 
                                                data={item}
                                                cbBg={this.props.selectEtape}
                                                getStepToStepDirection={this.getStepToStepDirection}
                                                showStepModal={this.showStepModal}
                                                showDirectionModal={this.showDirectionModal}
                                                deleteActivity={this.props.deleteActivity}
                                                modifyActivity={this.modifyActivity}
                                                modifyDirection={this.modifyDirection}
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


export default TimeLine;
