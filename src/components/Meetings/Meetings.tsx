import React from "react";

interface Meeting {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
  }
  
  // Создаём массив встреч с необходимыми данными
  const meetings: Meeting[] = [
    {
        id: 1,
        title: 'Тестовая встреча',
        description: 'Обсуждение тестового проекта',
        date: '23 февраля',
        time: '22:09',
    },
    {
        id: 2,
        title: 'Встреча с клиентом',
        description: 'Плановая встреча с важным клиентом',
        date: '14 февраля',
        time: '08:44',
    },
    {
        id: 3,
        title: 'Обновление проекта',
        description: 'Обсуждение обновлений в проекте',
        date: '1 февраля',
        time: '11:11',
    },
    {
        id: 4,
        title: 'Тестовая встреча',
        description: 'Обсуждение тестового проекта',
        date: '23 февраля',
        time: '22:09',
    },
    {
        id: 5,
        title: 'Встреча с клиентом',
        description: 'Плановая встреча с важным клиентом',
        date: '14 февраля',
        time: '08:44',
    },
    {
        id: 6,
        title: 'Обновление проекта',
        description: 'Обсуждение обновлений в проекте',
        date: '1 февраля',
        time: '11:11',
    },
  ];

const Meetings: React.FC = () => {
    return (
        <div className="container">
            <div className="column">
            <div className="row">
                <div className="col-12">
                    <h3 className="text-start my-4">Ближайшие встречи</h3>
                </div>
            </div>
            <div className="row">
                {meetings.map(meeting => (
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