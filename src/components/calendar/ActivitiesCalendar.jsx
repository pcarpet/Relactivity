import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import momentPlugin  from '@fullcalendar/moment'
import moment from "moment";
import Finder from './finder/Finder';
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";


 class ActivitiesCalendar extends React.Component {
  
    constructor(props) {
        super(props);
        
        this.state = { 
            customview :{
                dayTimeGridFourDay :{
                type: 'timeGrid',
                //duration: { days: 3 },
                visibleRange:{
                    start: '2023-02-12',
                    end: '2023-02-16'
                },
                buttonText: '5 days'
                }
            },
            customHeaderToolbar :{
                left: null,
                //center: "title",
                right: null,
            },
            openModal: false,
            openModalToModify: null,
            selectedEvent: null,
            activityActivityToModify: null,
        }

        this.closeFinderModal = this.closeFinderModal.bind(this);
        this.modifyActivity = this.modifyActivity.bind(this);
        this.deleteActivity = this.deleteActivity.bind(this);

    }
  
    mapActivitiesToEvent(activities) {

        const events = activities.map(a => {
            return {
                title: a.nomEtape,
                start: a.startDate.toISOString(),
                end: a.endDate.toISOString(),
                extendedProps: {
                    activitykey: a.key,
                    //On passe les fonctions directement dans l'event car le renderEventContent n'est pas capable de voir le contexte de cette class
                    modifyActivity : this.modifyActivity,
                    deleteActivity : this.deleteActivity
                }
            }
        });

        console.log(events);

        return events;

    }

    createNewEvent(info){
        //alert('selected ' + info.startStr + ' to ' + info.endStr);
        const selectedEvent = {startStr: info.startStr,endStr: info.endStr} 
        this.setState({selectedEvent: selectedEvent, openModal: true, openModalToModify: false});

    }
    
    modifyActivity = (key) => {
        const activity = this.props.activities.find((a) => key === a.key);
        this.setState({activityActivityToModify: activity, openModal: true, openModalToModify: true});
    }

    deleteActivity = (key) => {
        this.props.deleteActivity(key);
    }

    closeFinderModal = () => {
        this.setState({
            openModal: false,
            selectedEvent: null,  
            openModalToModify: null,
            activityActivityToModify: null});
    }

    renderEventContent(eventInfo){
        return(
            <>
                <div className="fc-event-main">
                    <div className="fc-event-main-frame">
                        <div className="fc-event-time">
                            {eventInfo.timeText} - 
                            <EditOutlined onClick={() => eventInfo.event.extendedProps.modifyActivity(eventInfo.event.extendedProps.activitykey)}/>
                            <DeleteOutlined onClick={() => eventInfo.event.extendedProps.deleteActivity(eventInfo.event.extendedProps.activitykey)}/>
                        </div>
                        <div className="fc-event-title-container">
                            <div className="fc-event-title">{eventInfo.event.title}</div>

                        </div>
                    </div>
                </div>


            </>
        )
    }


    render() {
        return (
        <>
            <Finder 
                openModal={this.state.openModal}
                isModify={this.state.openModalToModify}
                event={this.state.selectedEvent}
                activityActivityToModify={this.state.activityActivityToModify}
                closeModal={this.closeFinderModal}
                addEtape={this.props.addEtape}
            />

            <FullCalendar
                plugins={[ timeGridPlugin, interactionPlugin, momentPlugin]}
                locale='fr'
                initialView="dayTimeGridFourDay"
                headerToolbar={this.state.customHeaderToolbar}
                views={this.state.customview}
                allDaySlot={true}
                selectable={true}
                selectMirror={true}
                slotMinTime='07:00:00'
                slotMaxTime='22:00:00'
                slotDuration='00:30:00'
                select={(info) => this.createNewEvent(info)}
                events={this.mapActivitiesToEvent(this.props.activities)}
                eventContent={this.renderEventContent}
                
            />
        </>
        )
    }


}

export default ActivitiesCalendar;