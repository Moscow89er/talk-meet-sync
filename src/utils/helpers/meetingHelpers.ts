import { Meeting } from "../types/commonTypes";
import { formatDate } from "../formatters/formatDate";

// Функция преобразования даты и времени в объект Date требуемого нам формата
export const parseDate = (dateString: string, timeString: string) => {
    const [day, month, year] = dateString.split(".");
    const [hours, minutes] = timeString.split(":");
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
}

// Функция для проверки, есть ли перекрытие в конкретный день
export const isDateOverlapping = (day: number, displayDate: Date, overlappingMeetings: string[], isCurrentMonthDay: boolean): boolean => {
    if (!isCurrentMonthDay) return false;
    const date = formatDate(new Date(displayDate.getFullYear(), displayDate.getMonth(), day).toISOString(), {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    return overlappingMeetings.includes(date);
};

// Функция для проверки, запланирована ли встреча в конкретный день
export const isDateWithMeeting = (day: number, displayDate: Date, meetings: string[], isCurrentMonthDay: boolean): boolean => {
    if (!isCurrentMonthDay) return false;
    const date = formatDate(new Date(displayDate.getFullYear(), displayDate.getMonth(), day).toISOString(), {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    return meetings.includes(date);
};

export const filterMeetingsForSelectedDate = (meetings: Meeting[], selectedDate: string): Meeting[] => {
    if (typeof selectedDate === "string") {
      const allMeetingsForDate = meetings.filter(meeting => 
        meeting.date === formatDate(selectedDate, { year: "numeric", month: "2-digit", day: "2-digit" })
      );
  
      // Сортируем все встречи по времени начала
      return allMeetingsForDate.sort((a, b) => parseDate(a.date, a.startTime).getTime() - parseDate(b.date, b.startTime).getTime());
    }
    return []; // Если selectedDate не строка, возвращаем пустой массив
};