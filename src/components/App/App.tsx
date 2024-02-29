import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "../Header/Header";
import Calendar from "../Calendar/Calendar";
import Meetings from "../Meetings/Meetings";
import Popup from "../Popup/Popup";
import mainApi from "../../utils/api/MainApi";
import { User, Meeting } from "../../utils/types/commonTypes";

export const formatDateAsMoscowTime = (dateString: string, options: Intl.DateTimeFormatOptions) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', ...options });
    return formatter.format(date);
};

const fetchUsers = async (top: number, offset?: string): Promise<{ users: User[], offset: string }> => {
    try {
        const params = { top, offset };
        const response = await mainApi.getUsers(params);
        // Проверка, что мы получаем массив пользователей и значение offset из ответа
        if (!response.users || !response.offset) {
            throw new Error('Неправильный формат ответа API');
        }
        const usersData: User[] = response.users.map((user: any) => ({
            email: user.email,
            firstname: user.firstname,
            surname: user.surname,
            avatarUrl: user.avatarUrl,
        }));
        // Возвращаем и пользователей, и offset
        return { users: usersData, offset: response.offset };
    } catch (error) {
        console.error("Ошибка при получении данных о пользователях:", error);
        return { users: [], offset: '' }; // Возвращаем пустой массив и пустую строку offset
    }
};

const fetchMeetings = async (email: string): Promise<Meeting[]> => {
    try {
        const params = { email };
        const response = await mainApi.getEmailCalendar(params);
        
        // Преобразование данных API в формат интерфейса Meeting
        const meetingsData = response.items.map((item: any) => ({
            id: item.id,
            title: item.subject,
            name: item.organizer.name,
            date: formatDateAsMoscowTime(item.start, { year: 'numeric', month: '2-digit', day: '2-digit' }),
            startTime: formatDateAsMoscowTime(item.start, { hour: '2-digit', minute: '2-digit' }),
            endTime: formatDateAsMoscowTime(item.end, { hour: '2-digit', minute: '2-digit' }),
        }));
        return meetingsData;
    } catch (error) {
        console.error("Ошибка при получении данных о встречах:", error);
        return [];
    }
};

function parseDate(dateString: string, timeString: string) {
    const [day, month, year] = dateString.split(".");
    const [hours, minutes] = timeString.split(":");
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
}

// Функция для сравнения двух встреч по времени начала
const compareMeetings = (meetingFirst: Meeting, meetingSecond: Meeting) => {
    const startTimeFirst = parseDate(meetingFirst.date, meetingFirst.startTime).getTime();
    const startTimeSecond = parseDate(meetingSecond.date, meetingSecond.startTime).getTime();
    return startTimeFirst - startTimeSecond;
};
  
// Функция для определения пересекаются ли две встречи
const isOverlapping = (meetingFirst: Meeting, meetingSecond: Meeting) => {
    const startFirst = parseDate(meetingFirst.date, meetingFirst.startTime).getTime();
    const endFirst = parseDate(meetingFirst.date, meetingFirst.endTime).getTime();
    const startSecond = parseDate(meetingSecond.date, meetingSecond.startTime).getTime();
    const endSecond = parseDate(meetingSecond.date, meetingSecond.endTime).getTime();
    return startFirst < endSecond && startSecond < endFirst;
};

export default function App() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [overlappingMeetings, setOverlappingMeetings] = useState<Meeting[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const daysWithMeetings = new Set(meetings.map(m => m.date));
    const daysWithOverlappingMeetings = new Set(overlappingMeetings.map(m => m.date));

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
    
        for (let i = 0; i < sortedMeetings.length; i++) {
            for (let j = i + 1; j < sortedMeetings.length; j++) {
                if (isOverlapping(sortedMeetings[i], sortedMeetings[j])) {
                    if (!foundOverlappingMeetings.some(m => m.id === sortedMeetings[i].id)) {
                        foundOverlappingMeetings.push(sortedMeetings[i]);
                    }
                    if (!foundOverlappingMeetings.some(m => m.id === sortedMeetings[j].id)) {
                        foundOverlappingMeetings.push(sortedMeetings[j]);
                    }
                }
            }
        }
    
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
                <Popup
                    date={selectedDate}
                    meetings={meetings.filter(meeting => meeting.date === formatDateAsMoscowTime(selectedDate, { year: 'numeric', month: '2-digit', day: '2-digit' }))}
                    onClose={() => setIsPopupVisible(false)}
                />
            }
        </div>
    )
}