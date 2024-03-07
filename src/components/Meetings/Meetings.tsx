import React from "react";
import { MeetingsProps } from "../../utils/types/commonTypes";

const Meetings: React.FC<MeetingsProps> = ({ overlappingMeetings, hasSettings, isError }) => {
    // Ограничиваем список до последних 9 встреч
    const slicedMeetings = overlappingMeetings.slice(-9);

    const meetingList = slicedMeetings.map(meeting => (
        <div key={meeting.id} className="col-12 col-md-4 mb-3">
            <div className="card h-100">
                <div className="card-body">
                    <h5 className="card-title text-primary">{meeting.title}</h5>
                    <p className="card-text">{meeting.name}</p>
                </div>
                <div className="card-footer text-muted">
                    <time>{meeting.date}</time> | <time>{meeting.startTime} - {meeting.endTime}</time>
                </div>
            </div>
        </div>
    ))

    let headerText: string;

    if (isError) {
        headerText = "В настройках указаны не верные данные, проверьте их и введите снова";
    } else if (!hasSettings) {
        headerText = "Введите ваши данные в настройки, чтобы настроить работу сервиса";
    } else {
        headerText = overlappingMeetings.length !== 0 ? "Пересечение встреч" : "Пересечений между встречами нет";
    }

    return (
        <section className="container">
            <div className="column">
                <div className="row">
                    <div className="col-12">
                        <h3 className="text-start my-4 fw-bold">{headerText}</h3>
                    </div>
                </div>
                <div className="row">
                    {Array.isArray(slicedMeetings) && meetingList}
                </div>
            </div>
        </section>
    );
};

export default Meetings;