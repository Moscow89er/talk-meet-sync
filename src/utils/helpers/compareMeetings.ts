import { Meeting } from "../types/commonTypes";
import { formatDate } from "../formatters/formatDate";

export const parseDate = (dateString: string, timeString: string) => {
    const [day, month, year] = dateString.split(".");
    const [hours, minutes] = timeString.split(":");
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
}

// Функция для сравнения двух встреч по времени начала
export const compareMeetings = (meetingFirst: Meeting, meetingSecond: Meeting) => {
    const startTimeFirst = parseDate(meetingFirst.date, meetingFirst.startTime).getTime();
    const startTimeSecond = parseDate(meetingSecond.date, meetingSecond.startTime).getTime();
    return startTimeFirst - startTimeSecond;
};

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