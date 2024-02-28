import React, { useState, useEffect } from "react";
import mainApi from "../../utils/api/MainApi";
import { Meeting } from "../../utils/types/commonTypes";

const fetchMeetings = async (): Promise<Meeting[]> => {
    try {
        const params = { email: "khubaev.n@skbkontur.ru" };
        const response = await mainApi.getEmailCalendar(params);
        console.log(response); // Удалить после сборки
        // Преобразование данных API в формат интерфейса Meeting
        const meetingsData = response.items.map((item: any) => ({
            id: item.id,
            title: item.subject,
            description: item.description,
            date: item.start.substring(0, 10),
            time: `${item.start.substring(11, 16)} - ${item.end.substring(11, 16)}`,
        }));
        return meetingsData;
    } catch (error) {
        console.error("Ошибка при получении данных о встречах:", error);
        return [];
    }
};

const Meetings: React.FC = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);

    useEffect(() => {
    fetchMeetings()
      .then(data => {
        setMeetings(data);
      })
      .catch(error => {
        console.error("Ошибка при получении данных о встречах:", error);
      });
    }, []);

    return (
        <div className="container">
        <div className="column">
            <div className="row">
            <div className="col-12">
                <h3 className="text-start my-4">Пересечение встреч</h3>
            </div>
            </div>
            <div className="row">
                {Array.isArray(meetings) && meetings.map(meeting => (
                    <div key={meeting.id} className="col-12 col-md-4 mb-3">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title text-primary">{meeting.title}</h5>
                                <p className="card-text">{meeting.description}</p>
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
