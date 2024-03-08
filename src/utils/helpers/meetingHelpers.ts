import { Meeting } from "../types/commonInterfaces";
import { formatDate } from "../formatters/formatDate";

// Функция преобразования даты и времени в объект Date требуемого нам формата
export const parseDate = (dateString: string, timeString: string) => {
    const [day, month, year] = dateString.split(".");
    const [hours, minutes] = timeString.split(":");
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
}

// Функция для сравнения двух встреч по времени начала
export const sortMeetingsByStartTime = (meetingFirst: Meeting, meetingSecond: Meeting): number => {
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

// Функция для создания временной шкалы всех событий начала и окончания встреч
const createTimeLine = (meetings: Meeting[]): { time: number; type: "start" | "end"; meeting: Meeting }[] => {
    return meetings.flatMap(meeting => [
        { time: parseDate(meeting.date, meeting.startTime).getTime(), type: "start" as "start", meeting },
        { time: parseDate(meeting.date, meeting.endTime).getTime(), type: "end" as "end", meeting },
    ]).sort((a, b) => a.time - b.time || (a.type === "start" ? -1 : 1));
};

// Функция для определения всех пересекающихся встреч с учетом количества лицензий
export const findOverlappingMeetings = (meetings: Meeting[], numsOfLicence: number): Meeting[] => {
    const timeline = createTimeLine(meetings);
    let currentMeetings = 0;
    let activeMeetings = new Set<Meeting>(); // Для отслеживания активных встреч
    let overlappingMeetings = new Set<Meeting>();
  
    timeline.forEach(event => {
        if (event.type === "start") {
            activeMeetings.add(event.meeting);
            currentMeetings++;
            if (currentMeetings > numsOfLicence) {
                // Добавляем все активные встречи, так как они теперь пересекаются
                activeMeetings.forEach(meeting => overlappingMeetings.add(meeting));
            }
        } else {
            activeMeetings.delete(event.meeting);
            currentMeetings--;
            // Если количество активных встреч все еще пересекается, нужно обновить список пересекающихся встреч
            if (currentMeetings >= numsOfLicence) {
                activeMeetings.forEach(meeting => overlappingMeetings.add(meeting));
            }
        }
    });
  
    return Array.from(overlappingMeetings);
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