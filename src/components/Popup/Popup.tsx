import React from 'react';
import { PopupProps } from '../../utils/types/commonTypes';

const Popup: React.FC<PopupProps> = ({ date, meetings, onClose }) => {
    return (
        <div className="modal show popup" tabIndex={-1} style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Встречи на {date}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
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
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Popup;
