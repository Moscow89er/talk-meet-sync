import { Meeting } from "../types/commonTypes";
import { formatDate } from "../formatters/formatDate";

// Функция преобразования даты и времени в объект Date требуемого нам формата
export const parseDate = (dateString: string, timeString: string) => {
    const [day, month, year] = dateString.split(".");
    const [hours, minutes] = timeString.split(":");
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
}

export const filterUpcomingMeetings = (meetings: Meeting[], limit = 9) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Устанавливаем начало текущего дня

    const upcomingMeetings = meetings.filter(meeting => {
        const meetingDate = parseDate(meeting.date, "00:00"); // Используем начало дня для сравнения
        return meetingDate >= today;
    });

    // Ограничиваем список до заданного лимита встреч, по умолчанию до 9
    return upcomingMeetings.slice(0, limit);
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

// Функции помощники для тестирования функционала описанного в meetingWorker
const createTimeLine = (meetings: Meeting[]): { time: number; type: "start" | "end"; meeting: Meeting }[] => {
    const now = new Date().getTime(); // Получаем текущее время в миллисекундах

    return meetings.flatMap(meeting => {
        const startTime = parseDate(meeting.date, meeting.startTime).getTime();
        const endTime = parseDate(meeting.date, meeting.endTime).getTime();
        // Исключаем события, которые уже прошли
        if (endTime < now) return [];

        return [
            { time: startTime, type: "start" as const, meeting },
            { time: endTime, type: "end" as const, meeting },
        ];
    }).sort((a, b) => a.time - b.time || (a.type === "start" ? -1 : 1));
};

export const findOverlappingMeetings = (meetings: Meeting[], numsOfLicence: number): Meeting[] => {
    const timeline = createTimeLine(meetings);
    let currentMeetings = 0;
    const activeMeetings = new Set<Meeting>(); // Для отслеживания активных встреч
    const overlappingMeetings = new Set<Meeting>();
  
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

export const sortMeetingsByStartTime = (meetingFirst: Meeting, meetingSecond: Meeting): number => {
    const startTimeFirst = parseDate(meetingFirst.date, meetingFirst.startTime).getTime();
    const startTimeSecond = parseDate(meetingSecond.date, meetingSecond.startTime).getTime();
    
    return startTimeFirst - startTimeSecond;
};