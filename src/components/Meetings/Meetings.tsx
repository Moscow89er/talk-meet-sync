import React from "react";
import { filterUpcomingMeetings } from "../../utils/helpers/meetingHelpers";
import { MeetingsProps } from "../../utils/types/commonTypes";
import MeetingsList from "../MeetingsList/MeetingsList";

const Meetings: React.FC<MeetingsProps> = ({ overlappingMeetings, hasSettings, isError }) => {
    const slicedMeetings = filterUpcomingMeetings(overlappingMeetings);

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
                <MeetingsList meetings={slicedMeetings} />
            </div>
        </section>
    );
};

export default Meetings;