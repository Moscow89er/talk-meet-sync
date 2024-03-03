import React from "react";
import { MeetingsPopupProps } from "../../utils/types/commonTypes";

const MeetingsPopup: React.FC<MeetingsPopupProps> = ({ date, meetings }) => {
    return (
            <>
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
    );
};

export default MeetingsPopup;
