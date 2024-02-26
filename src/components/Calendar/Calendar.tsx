import React from "react";
import "./Calendar.css";

const Calendar: React.FC = () => {
    const generateCalendar = (): JSX.Element[] => {
        const year = 2024;
        const month = 1; // Февраль (отсчет месяцев начинается с 0)
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();
    
        // Скорректируем день недели для воскресенья (0 в JS) к европейскому формату (7)
        const dayOfWeek = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;
    
        // Стартовый индекс - день недели первого числа месяца
        const calendarDays: (number | null)[] = Array.from({ length: dayOfWeek - 1 }, () => null);
    
        // Заполняем остальные дни месяца
        for (let day = 1; day <= numberOfDaysInMonth; day++) {
          calendarDays.push(day);
        }
    
        // Добавляем пустые ячейки в конец, если месяц не заканчивается в воскресенье
        while (calendarDays.length % 7 !== 0) {
          calendarDays.push(null);
        }
    
        // Разделяем дни на недели
        const weeks: (number | null)[][] = [];
        for (let i = 0; i < calendarDays.length; i += 7) {
          weeks.push(calendarDays.slice(i, i + 7));
        }
    
        return weeks.map((week: (number | null)[], index: number) => (
          <tr key={index}>
            {week.map((day: number | null, dayIndex: number) => (
              <td key={dayIndex} className={day ? 'calendar__day' : 'calendar__empty'}>
                {day || ''}
              </td>
            ))}
          </tr>
        ));
      };

    return (
        <div className="calendar__container">
            <div className="container">
                <div className="calendar__container">
                    <header className="calendar-header d-flex justify-content-between p-2">
                    <button className="btn btn-primary">&lt;</button>
                    <h4>Февраль 2024</h4>
                    <button className="btn btn-primary">&gt;</button>
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