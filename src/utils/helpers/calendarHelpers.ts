import { DateRange } from "../types/commonTypes";

export const getPreviousDays = (firstDayOfMonth: number, lastDayOfLastMonth: number): number[] => {
    const previousDays = [];
    for (let i = firstDayOfMonth - 1; i > 0; i--) {
      previousDays.push(lastDayOfLastMonth - i + 1);
    }
    return previousDays;
};
  
export const getCurrentDays = (numberOfDaysInMonth:number): number[] => {
    const currentDays = [];
    for (let day = 1; day <= numberOfDaysInMonth; day++) {
        currentDays.push(day);
    }
    return currentDays;
};

export const getNextDays = (_calendarDays: number[], dayOfWeek: number, numberOfDaysInMonth: number): number[] => {
    const nextDays = [];
    // Последний индекс в массиве calendarDays - это последний день текущего месяца
    // Определяем, сколько дней нужно добавить, чтобы заполнить неделю
    const lastDayIndex = dayOfWeek - 1 + numberOfDaysInMonth; // Индекс последнего дня в текущем месяце
    let daysToAdd = 7 - (lastDayIndex % 7); // Сколько дней нужно добавить до конца недели
    if (daysToAdd === 7) {
        daysToAdd = 0; // Если неделя уже полная, не добавляем ничего
    }
    for (let i = 1; i <= daysToAdd; i++) {
        nextDays.push(i);
    }
    return nextDays;
};

export const getWeeks = (days: number[]): number[][] => {
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }
    return weeks;
};

// Функция для определения полного диапазона дат месяца календаря, который затем может быть использован для загрузки данных за этот период
export const getCalendarMonthDateRange = (date: Date): DateRange => {
    const startOfMonth = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59));

    // Форматирование дат в ISO строку
    const format = (date: Date) => date.toISOString();

    return { startDate: format(startOfMonth), endDate: format(endOfMonth) };
};

// Функция для определения полного диапазона дат текущего месяца
export const getCurrentMonthDateRange = (): DateRange => {
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59));
  
    const format = (date: Date) => date.toISOString();
    
    return { startDate: format(startOfMonth), endDate: format(endOfMonth) };
};