import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import Finder from './finder/Finder';
import dayjs from "dayjs";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";


 class ActivitiesCalendar extends React.Component {
  
    constructor(props) {
        super(props);
        
        this.state = { 
            customHeaderToolbar :{
                left: null,
                //center: "title",
                right: null,
            },
            openModal: false,
            openModalToModify: null,
            selectedEvent: null,
            activityToModify: null,
        }

        this.closeFinderModal = this.closeFinderModal.bind(this);
        this.modifyActivity = this.modifyActivity.bind(this);
        this.deleteActivity = this.deleteActivity.bind(this);

    }
  
    getCustomView(selectedTrip){
        return({
            dayTimeGridFourDay :{
            type: 'timeGrid',
            //duration: { days: 3 },
            visibleRange:{
                start: selectedTrip.dateRange[0].format('YYYY-MM-DD'),
                end: selectedTrip.dateRange[1].add(1,'day').format('YYYY-MM-DD')
            },
            buttonText: '5 days'
            }
        })
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
        const selectedEvent = {startStr: info.startStr,endStr: info.endStr} 
        this.setState({selectedEvent: selectedEvent, openModal: true, openModalToModify: false, activityToModify: null});
    }
    
    modifyActivity = (key) => {
        const activity = this.props.activities.find((a) => key === a.key);
        this.setState({activityToModify: activity, openModal: true, openModalToModify: true, selectedEvent: null});
    }

    deleteActivity = (key) => {
        this.props.deleteActivity(key);
    }

    closeFinderModal = () => {
        this.setState({
            openModal: false,
            selectedEvent: null,  
            openModalToModify: null,
            activityToModify: null});
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
                //On bricole la génération d'une clef pour réinitialiser le composant sinon le init du Form ne met pas à jour et reste sur la derniere instance.
                key={this.state.openModalToModify?this.state.activityToModify.key:dayjs().unix()}
                openModal={this.state.openModal}
                isModify={this.state.openModalToModify}
                event={this.state.selectedEvent}
                activityToModify={this.state.activityToModify}
                closeModal={this.closeFinderModal}
                addEtape={this.props.addEtape}
            />

            <FullCalendar
                plugins={[ timeGridPlugin, interactionPlugin]}
                locale='fr'
                initialView="dayTimeGridFourDay"
                headerToolbar={this.state.customHeaderToolbar}
                views={this.getCustomView(this.props.selectedTrip)}
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