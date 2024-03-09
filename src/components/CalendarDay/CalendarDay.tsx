import React from "react";
import { isDateOverlapping, isDateWithMeeting } from "../../utils/helpers/meetingHelpers";
import { CalendarDayProps } from "../../utils/types/commonTypes";

const CalendarDay:React.FC<CalendarDayProps> = ({
    day,
    isPrevMonth,
    isNextMonth,
    isCurrentDay,
    onDayClick,
    displayDate,
    overlappingMeetings,
    meetings,
  }) => {
    let className = "calendar__day";
    if (isCurrentDay) className += " calendar__day--current";
    if (isPrevMonth) className += " calendar__day--prev";
    if (isNextMonth) className += " calendar__day--next";

    if (isDateOverlapping(day, displayDate, overlappingMeetings, !isPrevMonth && !isNextMonth)) {
        className += " calendar__day--overlapping";
    } else if (isDateWithMeeting(day, displayDate, meetings, !isPrevMonth && !isNextMonth)) {
        className += " calendar__day--meeting";
    }
  
    return (
      <td
        className={className}
        onClick={onDayClick}
      >
        {day}
      </td>
    );
};

export default CalendarDay;