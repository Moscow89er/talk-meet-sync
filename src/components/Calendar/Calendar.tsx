import React, { useState } from "react";
import "./Calendar.css";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState(new Date());

  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

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
          const isCurrentDay = isCurrentMonth && day === currentDay;
          const isPrevMonth = dayPosition < dayOfWeek - 1; // Если позиция дня меньше, чем смещение первого дня месяца
          const isNextMonth = dayPosition >= (dayOfWeek - 1 + numberOfDaysInMonth); // Если позиция дня больше или равна смещению плюс количество дней в месяце
          let className = "calendar__day";
          if (isCurrentDay) className += " calendar__day--current";
          if (isPrevMonth) className += " calendar__day--prev";
          if (isNextMonth) className += " calendar__day--next";
    
          return (
            <td key={dayIndex} className={className}>
              {day}
            </td>
          );
        })}
      </tr>
    ));
  };

  const handlePrevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
      setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };

  return (
    <div className="calendar__container">
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
                        {generateCalendar()}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}

export default Calendar;