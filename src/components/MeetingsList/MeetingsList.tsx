import React from "react";
import { MeetingsListProps } from "../../utils/types/commonTypes";

const MeetingsList:React.FC<MeetingsListProps> = ({ meetings }) => {
    const meetingList = meetings.map(meeting => (
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
    ));

    return (
        <div className="row">
            {meetingList}
        </div>
    );
}

export default MeetingsList;