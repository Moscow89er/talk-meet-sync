import React from "react";
import CalendarDay from "../CalendarDay/CalendarDay";
import { getPreviousDays, getCurrentDays, getNextDays, getWeeks } from "../../utils/helpers/calendarHelpers";
import { CalendarGridProps } from "../../utils/types/commonInterfaces";

const CalendarGrid: React.FC<CalendarGridProps> = ({
  displayDate,
  currentDate,
  overlappingMeetings,
  meetings,
  handleDayClick
}) => {
  // Функция генерирующая календарь
  const generateCalendar = () => {
    // Получаем год из текущего отображаемого месяца
    const year = displayDate.getFullYear();
    // Получаем месяц из текущего отображаемого месяца (отсчет начинается с 0)
    const month = displayDate.getMonth();
    // Получаем день недели первого дня месяца. Если это воскресенье, возвращается 0
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // Определяем количество дней в текущем месяце
    const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();
    // Получаем количество дней в предыдущем месяце, что нужно для вычисления дней, которые отображаются в календаре из предыдущего месяца
    const lastDayOfLastMonth = new Date(year, month, 0).getDate();

    // Корректируем день недели для первого дня месяца, преобразуя воскресенье из 0 в 7 для удобства расчетов
    const dayOfWeek = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;

    // Получаем массив предыдущих дней, которые должны быть показаны в календаре до первого числа текущего месяца
    const previousDays = getPreviousDays(dayOfWeek, lastDayOfLastMonth);
    // Получаем массив дней для текущего месяца
    const currentDays = getCurrentDays(numberOfDaysInMonth);
    // Объединяем массивы предыдущих и текущих дней
    const calendarDays = [...previousDays, ...currentDays];
    // Вычисляем и получаем массив следующих дней, которые должны быть показаны после последнего числа текущего месяца
    const nextDays = getNextDays(calendarDays, dayOfWeek, numberOfDaysInMonth);

    // Объединяем все дни в один массив для отображения в календаре
    const allDays = [...calendarDays, ...nextDays];
    // Разбиваем все дни на недели для отображения в таблице календаря
    const weeks = getWeeks(allDays);

    // Проверяем, соответствует ли месяц и год отображаемой даты текущему месяцу и году, чтобы выделить текущий день
    const isCurrentMonth = currentDate.getMonth() === displayDate.getMonth() &&
    currentDate.getFullYear() === displayDate.getFullYear();
    // Получаем число текущего дня, чтобы выделить его в календаре, если отображаемый месяц является текущим месяцем
    const currentDay = currentDate.getDate();

    return weeks.map((week, index) => (
      <tr key={index}>
        {week.map((day, dayIndex) => {
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

  return (
    <tbody>{generateCalendar()}</tbody>
  );
}

export default CalendarGrid;