import { Meeting, sortAndIdentifyOverlaps } from "../types/commonTypes";

// Функция преобразования даты и времени в объект Date требуемого нам формата
export const parseDate = (dateString: string, timeString: string): Date => {
    const [day, month, year] = dateString.split(".");
    const [hours, minutes] = timeString.split(":");
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
}

// Функция для создания временной шкалы всех событий начала и окончания встреч
export const createTimeLine = (meetings: Meeting[]): { time: number; type: "start" | "end"; meeting: Meeting }[] => {
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

// Функция сортировки встреч по времени начала
export const sortMeetingsByStartTime = (meetings: Meeting[]): Meeting[] => {
    return meetings.sort((meetingFirst, meetingSecond): number => {
        // Преобразование даты и времени начала в числовой формат для сравнения
        const startTimeFirst = parseDate(meetingFirst.date, meetingFirst.startTime).getTime();
        const startTimeSecond = parseDate(meetingSecond.date, meetingSecond.startTime).getTime();
        // Возвращение разницы между временами начала для сортировки
        return startTimeFirst - startTimeSecond;
    });
};

// Обработка сообщений, отправленных в Web Worker
self.onmessage = (event: MessageEvent<sortAndIdentifyOverlaps>) => {
    // Извлечение действия и данных из полученного сообщения
    const { action, data } = event.data;

    // Обработка разных действий в зависимости от указанного типа действия
    switch (action) {
        // Сортировка встреч по времени начала, поиск перекрывающихся встреч
        case "sortAndIdentifyOverlaps": {
            // Приведение типа данных и извлечение необходимых значений
            const { meetings, numsOfLicence } = data as { meetings: Meeting[]; numsOfLicence: number };

            // Сортировка встреч по времени начала
            const sortedMeetings = sortMeetingsByStartTime(meetings)

            // Создание временной шкалы для всех встреч
            const timeline = createTimeLine(sortedMeetings);
            let currentMeetings = 0;
            const activeMeetings = new Set<Meeting>();
            const overlappingMeetings = new Set<Meeting>();

            // Перебор всех событий во временной шкале
            timeline.forEach(event => {
                // Если событие является началом встречи
                if (event.type === "start") {
                    // Добавляем встречу в активные и увеличиваем счётчик
                    activeMeetings.add(event.meeting);
                    currentMeetings++;
                    // Если количество активных встреч превышает доступное число лицензий
                    if (currentMeetings > numsOfLicence) {
                        // Добавляем все активные встречи в перекрывающиеся
                        activeMeetings.forEach(meeting => overlappingMeetings.add(meeting));
                    }
                } else {
                    // Если событие является окончанием встречи
                    // Удаляем встречу из активных и уменьшаем счётчик
                    activeMeetings.delete(event.meeting);
                    currentMeetings--;
                    // Проверяем, необходимо ли обновить список перекрывающихся встреч
                    if (currentMeetings >= numsOfLicence) {
                        activeMeetings.forEach(meeting => overlappingMeetings.add(meeting));
                    }
                }
            });

            self.postMessage({ action, data: { sortedMeetings, overlappingMeetings: Array.from(overlappingMeetings) } });
            break;
        }
        // Обработка неизвестного действия
        default:
            console.error(`Unknown meeting action: ${action}`);
            return;
    }
};