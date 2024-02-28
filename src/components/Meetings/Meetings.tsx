import React from "react";
import { MeetingsProps } from "../../utils/types/commonTypes";

const Meetings: React.FC<MeetingsProps> = ({ meetings }) => {
    const slicedMeetings = meetings.slice().reverse().slice(0, 6);

    return (
        <div className="container">
        <div className="column">
            <div className="row">
            <div className="col-12">
                <h3 className="text-start my-4">Пересечение встреч</h3>
            </div>
            </div>
            <div className="row">
                {Array.isArray(slicedMeetings) && slicedMeetings.map(meeting => (
                    <div key={meeting.id} className="col-12 col-md-4 mb-3">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title text-primary">{meeting.title}</h5>
                                <p className="card-text">{meeting.name}</p>
                            </div>
                            <div className="card-footer text-muted">
                                <span>{meeting.date}</span> | <span>{meeting.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default Meetings;
