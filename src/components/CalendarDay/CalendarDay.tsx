import React, { useMemo } from "react";
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
    // Предварительная проверка, является ли день частью текущего месяца
    const isCurrentMonth = !isPrevMonth && !isNextMonth;

    const className = useMemo(() => {
      let baseClass = "calendar__day";
      if (isCurrentDay) baseClass += " calendar__day--current";
      if (isPrevMonth) baseClass += " calendar__day--prev";
      if (isNextMonth) baseClass += " calendar__day--next";
      
      const isOverlapping = isDateOverlapping(day, displayDate, overlappingMeetings, isCurrentMonth);
      const hasMeeting = isDateWithMeeting(day, displayDate, meetings, isCurrentMonth);
      
      if (isOverlapping) {
        return `${baseClass} calendar__day--overlapping`;
      } else if (hasMeeting) {
        return `${baseClass} calendar__day--meeting`;
      }
      return baseClass;
    }, [day, isPrevMonth, isNextMonth, isCurrentDay, displayDate, overlappingMeetings, meetings]);
  
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