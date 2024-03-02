import React, { useEffect, useState, useMemo, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "../Header/Header";
import Calendar from "../Calendar/Calendar";
import Meetings from "../Meetings/Meetings";
import Popup from "../Popup/Popup";
import MeetingsPopup from "../MeetingsPopup/MeetingsPopup";
import { User, Meeting } from "../../utils/types/commonTypes";
import { fetchUsers, fetchMeetings } from "../../utils/api/dataFetching";
import { formatDate } from "../../utils/formatters/formatDate";
import { compareMeetings } from "../../utils/helpers/compareMeetings";
import { isOverlapping } from "../../utils/helpers/compareMeetings";

export default function App() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [overlappingMeetings, setOverlappingMeetings] = useState<Meeting[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const daysWithMeetings = useMemo(() => new Set(meetings.map(m => m.date)), [meetings]);
    const daysWithOverlappingMeetings = useMemo(() => new Set(overlappingMeetings.map(m => m.date)), [overlappingMeetings]);

    const filteredMeetingsForSelectedDate = useMemo((): Meeting[] => {
        // Убедимся, что selectedDate является строкой для корректного сравнения
        if (typeof selectedDate === 'string') {
            return meetings.filter(meeting => 
                meeting.date === formatDate(selectedDate, { year: 'numeric', month: '2-digit', day: '2-digit' })
            );
        }
        return []; // Если selectedDate не строка, возвращаем пустой массив
    }, [meetings, selectedDate]);

    const closePopup = useCallback(() => {
        setIsPopupVisible(false);
    }, []);

    const handleFetchMeetingsForAllUsers = async () => {
        let currentOffset: string | undefined = undefined;
        let allUsers: User[] = [];
        let hasMoreUsers: boolean = true;
    
        // Получаем пользователей постранично, пока есть данные
        while (hasMoreUsers) {
            const { users, offset: newOffset } = await fetchUsers(10, currentOffset);
            if (users.length > 0) {
                allUsers = [...allUsers, ...users];
                currentOffset = newOffset;
            } else {
                hasMoreUsers = false;
            }
        }
    
        // После получения списка всех пользователей, запросим встречи для каждого
        const meetingsPromises = allUsers.map(user => fetchMeetings(user.email));
        const meetingsResults = await Promise.all(meetingsPromises);
        const allMeetings = meetingsResults.flat();
    
        // Сортируем встречи по времени начала
        const sortedMeetings = [...allMeetings].sort(compareMeetings); // Используйте allMeetings здесь
    
        // Находим пересекающиеся встречи
        let foundOverlappingMeetings: Meeting[] = [];
    
        sortedMeetings.forEach((meeting, i) => {
            sortedMeetings.slice(i + 1).forEach(otherMeeting => {
              if (isOverlapping(meeting, otherMeeting)) {
                if (!foundOverlappingMeetings.some(m => m.id === meeting.id)) {
                  foundOverlappingMeetings.push(meeting);
                }
                if (!foundOverlappingMeetings.some(m => m.id === otherMeeting.id)) {
                  foundOverlappingMeetings.push(otherMeeting);
                }
              }
            });
          });
          
        // Устанавливаем полученные данные о встречах в состояние
        setMeetings(allMeetings);
        setOverlappingMeetings(foundOverlappingMeetings); // Обновляем состояние с пересекающимися встречами
    };
     
    useEffect(() => {
        handleFetchMeetingsForAllUsers();
    }, []);
    
    return (
        <div className="full-height">
            <Header />
            <div className="content-expand bg-light p-4">
                <Calendar
                    onDateSelect={setSelectedDate}
                    onIsPopupVisible={setIsPopupVisible}
                    overlappingMeetings={Array.from(daysWithOverlappingMeetings)}
                    meetings={Array.from(daysWithMeetings)}
                />
                <Meetings overlappingMeetings={overlappingMeetings}/>
            </div>
            {isPopupVisible &&
                <Popup onClose={() => setIsPopupVisible(false)}>
                    <MeetingsPopup date={selectedDate} meetings={filteredMeetingsForSelectedDate} onClose={() => setIsPopupVisible(false)} />
                </Popup>
            }
        </div>
    )
}