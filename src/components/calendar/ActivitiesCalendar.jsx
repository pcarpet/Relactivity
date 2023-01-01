import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import { toDuration } from '@fullcalendar/moment'
import moment from "moment";

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
            }
        }

    }
  
    mapActivitiesToEvent(activities) {

        const events = activities.map(a => {
            var startDate = a.date.format('YYYY-MM-DD') + 'T' + a.heureDebut.format('HH:mm');
            var endDate = a.date.format('YYYY-MM-DD') + 'T' + a.heureFin.format('HH:mm');
            console.log(startDate);
            return {
                title: a.nomEtape,
                start: startDate,
                end: endDate
            }
        });

        return events;

    }

    createNewEvent(info){
       alert('selected ' + info.startStr + ' to ' + info.endStr);
    }

    render() {
        return (
            <FullCalendar
                plugins={[ timeGridPlugin, interactionPlugin]}
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
        )
    }


}

export default ActivitiesCalendar;