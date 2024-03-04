import React, { useState, useMemo, useCallback } from "react";
import { CalendarProps } from "../../utils/types/commonTypes";
import { isDateOverlapping, isDateWithMeeting } from "../../utils/helpers/compareMeetings";
import { monthNames } from "../../utils/constants/constants";
import "./Calendar.css";

const Calendar: React.FC<CalendarProps> = ({ 
  onDateSelect,
  onIsPopupVisible,
  overlappingMeetings,
  meetings
 }) => {
  const [displayDate, setDisplayDate] = useState(new Date());
  const currentDate = new Date();

  const generateCalendar = (): JSX.Element[] => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfLastMonth = new Date(year, month, 0).getDate();

    // Скорректируем день недели для воскресенья (0 в JS) к европейскому формату (7)
    const dayOfWeek = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;

    // Заполняем предыдущие дни
    const calendarDays: number[] = [];
    for (let i = dayOfWeek - 1; i > 0; i--) {
      calendarDays.push(lastDayOfLastMonth - i + 1);
    }

    // Заполнем текущие дни месяца
    for (let day = 1; day <= numberOfDaysInMonth; day++) {
      calendarDays.push(day);
    }

    // Заполняем следующие дни
    let nextMonthDay = 1;
    while (calendarDays.length % 7 !== 0) {
      calendarDays.push(nextMonthDay++);
    }

    // Разделяем дни на недели
    const weeks: (number | null)[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }

    // Подсветим текущую дату
    const isCurrentMonth = currentDate.getMonth() === displayDate.getMonth() &&
    currentDate.getFullYear() === displayDate.getFullYear();
    
    const currentDay = currentDate.getDate();

    return weeks.map((week: number[], index: number) => (
      <tr key={index}>
        {week.map((day: number, dayIndex: number) => {
          const dayPosition = index * 7 + dayIndex; // Позиция дня в общем массиве дней
          const isPrevMonth = dayPosition < dayOfWeek - 1; // Если позиция дня меньше, чем смещение первого дня месяца
          const isNextMonth = dayPosition >= (dayOfWeek - 1 + numberOfDaysInMonth); // Если позиция дня больше или равна смещению плюс количество дней в месяце
          const isCurrentDay = isCurrentMonth && day === currentDay && !isPrevMonth && !isNextMonth;

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
              key={dayIndex}
              className={className}
              onClick={() => handleDayClick(day, !isPrevMonth && !isNextMonth)}>
                {day}
            </td>
        );
        })}
      </tr>
    ));
  };

  const calendar = useMemo(() => generateCalendar(), [displayDate, overlappingMeetings, meetings]);

  const handlePrevMonth = useCallback(() => {
    setDisplayDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setDisplayDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  }, []);

  const handleDayClick = useCallback((day: number, isCurrentMonthDay: boolean) => {
    if (!isCurrentMonthDay) return; // Игнорируем клики по дням других месяцев
  
    // Форматируем месяц и день, добавляя ведущий ноль при необходимости
    const month = (displayDate.getMonth() + 1).toString().padStart(2, "0");
    const formattedDay = day.toString().padStart(2, "0");
    const formattedDate = `${displayDate.getFullYear()}-${month}-${formattedDay}`;
  
    onDateSelect(formattedDate);
    onIsPopupVisible(true);
  }, [onDateSelect, onIsPopupVisible, displayDate]);

  return (
    <section className="calendar__container">
        <div className="container">
            <div className="calendar__container">
                <header className="calendar-header d-flex justify-content-between p-2">
                    <button className="btn btn-primary" onClick={handlePrevMonth}>&lt;</button>
                    <h4>{`${monthNames[displayDate.getMonth()]} ${displayDate.getFullYear()}`}</h4>
                    <button className="btn btn-primary" onClick={handleNextMonth}>&gt;</button>
                </header>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Пн</th>
                            <th>Вт</th>
                            <th>Ср</th>
                            <th>Чт</th>
                            <th>Пт</th>
                            <th>Сб</th>
                            <th>Вс</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calendar}
                    </tbody>
                </table>
            </div>
        </div>
    </section>
  );
}

export default React.memo(Calendar);