import React from "react";
import Popup from "../Popup/Popup";
import { formatDate } from '../../utils/formatters/formatDate';
import { MeetingsPopupProps } from "../../utils/types/commonTypes";

const MeetingsPopup: React.FC<MeetingsPopupProps> = ({ date, meetings, onClose }) => {
    return (
        <Popup onClose={onClose}>
            <>
                <h5 className="modal-title">Встречи на {formatDate(date)}</h5>
                {meetings.length > 0 ? (
                    <ul>
                        {meetings.map((meeting) => (
                            <li key={meeting.id}>
                                <strong>{meeting.title}</strong><br />
                                {meeting.date} | {meeting.startTime} - {meeting.endTime}<br />
                                Организатор: {meeting.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>На эту дату встречи не запланированы.</p>
                )}
            </>
        </Popup>
    );
};

export default MeetingsPopup;
