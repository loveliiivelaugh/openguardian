import type { Dispatch, SetStateAction } from 'react';
import type { View, SlotInfo } from 'react-big-calendar';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";

interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
};

interface CalendarPropsType {
    events?: CalendarEvent[] | undefined | null;
    view: View;
    date?: Date;
    setCalendar?: (calendar: any) => void;
    handleSelectEvent?: (event: CalendarEvent) => void;
    handleSelectSlot?: (slot: SlotInfo) => void;
};

const localizer = momentLocalizer(moment);
const scrollToTime = new Date();
scrollToTime.setHours(16);

const ReusableCalendar: React.FC<CalendarPropsType> = (props) => (
    <div style={{ width: "100%" }}>
        <Calendar
            localizer={localizer}
            events={props.events ?? []}
            view={props.view}
            date={props.date}
            onView={(view: View) => props?.setCalendar ? props.setCalendar((old: any) => ({ ...old, view })) : view}
            defaultView={Views.MONTH}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={props.handleSelectEvent}
            onSelectSlot={props.handleSelectSlot}
            selectable
            scrollToTime={scrollToTime}
            style={{
                height: "70vh",
                width: "98vw",
                color: "inherit"
            }}
        />
    </div>
);

export default ReusableCalendar;
export type { CalendarEvent, View };