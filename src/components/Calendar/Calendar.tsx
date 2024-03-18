import React, { useState, useCallback } from "react";
import CalendarGrid from "../CalendarGrid/CalendarGrid";
import { CalendarProps } from "../../utils/types/commonTypes";
import { monthNames } from "../../utils/constants/constants";
import "./Calendar.css";

const Calendar: React.FC<CalendarProps> = ({ 
  onDateSelect,
  onOpenPopup,
  overlappingMeetings,
  meetings,
  onMonthChange
 }) => {
  const [displayDate, setDisplayDate] = useState(new Date());

  const handleChangeMonth = useCallback((direction: number) => {
    setDisplayDate(prevDate => {
      // Вычисляем новую дату, сдвигая текущий месяц на direction
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + direction, 1);
      onMonthChange(newDate);
      return newDate;
    });
  }, [onMonthChange]);

  const handleDayClick = useCallback((day: number, isCurrentMonthDay: boolean) => {
    if (!isCurrentMonthDay) return; // Игнорируем клики по дням других месяцев
  
    // Форматируем месяц и день, добавляя ведущий ноль при необходимости
    const month = (displayDate.getMonth() + 1).toString().padStart(2, "0");
    const formattedDay = day.toString().padStart(2, "0");
    const formattedDate = `${displayDate.getFullYear()}-${month}-${formattedDay}`;
  
    onDateSelect(formattedDate);
    onOpenPopup(true);
  }, [onDateSelect, onOpenPopup, displayDate]);

  return (
    <section className="calendar__container">
        <div className="container">
            <div className="calendar__container">
                <header className="calendar-header d-flex justify-content-between p-2">
                    <button className="btn btn-primary" onClick={() => handleChangeMonth(-1)}>&lt;</button>
                    <h4>{`${monthNames[displayDate.getMonth()]} ${displayDate.getFullYear()}`}</h4>
                    <button className="btn btn-primary" onClick={() => handleChangeMonth(1)}>&gt;</button>
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
                    <CalendarGrid
                      displayDate={displayDate}
                      overlappingMeetings={overlappingMeetings}
                      meetings={meetings}
                      handleDayClick={handleDayClick}
                    />
                </table>
            </div>
        </div>
    </section>
  );
}

export default React.memo(Calendar);