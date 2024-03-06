import React, { useState, useMemo, useCallback } from "react";
import CalendarDay from "../CalendarDay/CalendarDay";
import { CalendarProps } from "../../utils/types/commonTypes";
import { monthNames } from "../../utils/constants/constants";
import { getPreviousDays, getCurrentDays, getNextDays, getWeeks } from "../../utils/helpers/calendarHelpers";
import "./Calendar.css";

const Calendar: React.FC<CalendarProps> = ({ 
  onDateSelect,
  onIsPopupVisible,
  overlappingMeetings,
  meetings
 }) => {
  const [displayDate, setDisplayDate] = useState(new Date());
  const currentDate = new Date();

  // Функция генерирующая календарь
  const generateCalendar = (): JSX.Element[] => {
    // Определяем базовые переменные
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfLastMonth = new Date(year, month, 0).getDate();
    // Скорректируем день недели для воскресенья (0 в JS) к европейскому формату (7)
    const dayOfWeek = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;

    const previousDays = getPreviousDays(dayOfWeek, lastDayOfLastMonth);
    const currentDays = getCurrentDays(numberOfDaysInMonth);
    const calendarDays = [...previousDays, ...currentDays];
    const nextDays = getNextDays(calendarDays, dayOfWeek, numberOfDaysInMonth);

    const allDays = [...calendarDays, ...nextDays];
    const weeks = getWeeks(allDays);

    // Подсветим текущую дату
    const isCurrentMonth = currentDate.getMonth() === displayDate.getMonth() &&
    currentDate.getFullYear() === displayDate.getFullYear();
    const currentDay = currentDate.getDate();

    return weeks.map((week: number[], index: number) => (
      <tr key={index}>
        {week.map((day: number, dayIndex: number) => {
          const dayPosition = index * 7 + dayIndex;
          const isPrevMonth = dayPosition < dayOfWeek - 1;
          const isNextMonth = dayPosition >= (dayOfWeek - 1 + numberOfDaysInMonth);
          const isCurrentDay = isCurrentMonth && day === currentDay && !isPrevMonth && !isNextMonth;
  
          return (
            <CalendarDay
              key={dayIndex}
              day={day}
              isPrevMonth={isPrevMonth}
              isNextMonth={isNextMonth}
              isCurrentDay={isCurrentDay}
              onDayClick={() => handleDayClick(day, !isPrevMonth && !isNextMonth)}
              displayDate={displayDate}
              overlappingMeetings={overlappingMeetings}
              meetings={meetings}
            />
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