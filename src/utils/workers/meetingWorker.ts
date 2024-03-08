import { parseDate, createTimeLine } from "../helpers/meetingHelpers";
import { Meeting } from "../types/commonInterfaces";

self.onmessage = (event) => {
    const { action, data } = event.data;
    
    let result;

    switch (action) {
        case 'sortMeetingsByStartTime':
            result = data.sort((meetingFirst: Meeting, meetingSecond: Meeting): number => {
                const startTimeFirst = parseDate(meetingFirst.date, meetingFirst.startTime).getTime();
                const startTimeSecond = parseDate(meetingSecond.date, meetingSecond.startTime).getTime();
                return startTimeFirst - startTimeSecond;
            });
            break;
        case 'findOverlappingMeetings':
            // Взятие данных напрямую из event.data
            const meetings = data.meetings;
            const numsOfLicence = data.numsOfLicence;

            // Сама функция findOverlappingMeetings интегрирована здесь
            const timeline = createTimeLine(meetings);
            let currentMeetings = 0;
            let activeMeetings = new Set(); // Убран тип Meeting для совместимости внутри Worker
            let overlappingMeetings = new Set();

            timeline.forEach(event => {
                if (event.type === "start") {
                    activeMeetings.add(event.meeting);
                    currentMeetings++;
                    if (currentMeetings > numsOfLicence) {
                        activeMeetings.forEach(meeting => overlappingMeetings.add(meeting));
                    }
                } else {
                    activeMeetings.delete(event.meeting);
                    currentMeetings--;
                    if (currentMeetings >= numsOfLicence) {
                        activeMeetings.forEach(meeting => overlappingMeetings.add(meeting));
                    }
                }
            });

            result = Array.from(overlappingMeetings);
            break;
        default:
            console.error(`Unknown action: ${action}`);
            return;
    }

    self.postMessage({ action: action, data: result });
};