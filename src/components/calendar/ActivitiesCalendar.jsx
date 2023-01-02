import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import momentPlugin  from '@fullcalendar/moment'
import moment from "moment";
import Finder from './finder/Finder';

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
            selectedEvent: null
        }

        this.closeFinderModal = this.closeFinderModal.bind(this);

    }
  
    mapActivitiesToEvent(activities) {

        const events = activities.map(a => {
            return {
                title: a.nomEtape,
                start: a.startDate.toISOString(),
                end: a.endDate.toISOString()
            }
        });

        console.log(events);

        return events;

    }

    createNewEvent(info){
        //alert('selected ' + info.startStr + ' to ' + info.endStr);
        const selectedEvent = {startStr: info.startStr,endStr: info.endStr} 
        this.setState({selectedEvent: selectedEvent, openModal: true});

    }

    closeFinderModal = () => {
        this.setState({selectedEvent: null, openModal: false});
    }

    render() {
        return (
        <>
            <Finder 
                openModal={this.state.openModal}
                isModify={false}
                event={this.state.selectedEvent}
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
                events={this.mapActivitiesToEvent(this.props.activities)}
                select={(info) => this.createNewEvent(info)}
                
                />
        </>
        )
    }


}

export default ActivitiesCalendar;