import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Calendar from "../Calendar/Calendar";
import Meetings from "../Meetings/Meetings";
import Popup from "../Popup/Popup";
import "bootstrap/dist/css/bootstrap.min.css";
import mainApi from "../../utils/api/MainApi";
import { User, Meeting } from "../../utils/types/commonTypes";

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
            date: item.start.substring(0, 10),
            time: `${item.start.substring(11, 16)} - ${item.end.substring(11, 16)}`,
        }));
        return meetingsData;
    } catch (error) {
        console.error("Ошибка при получении данных о встречах:", error);
        return [];
    }
};

export default function App() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

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
        const allMeetings = [];
        for (const user of allUsers) {
            const userMeetings = await fetchMeetings(user.email);
            allMeetings.push(...userMeetings);
        }
    
        // Устанавливаем полученные данные о встречах в состояние
        setMeetings(allMeetings);
    };
    
    useEffect(() => {
        handleFetchMeetingsForAllUsers();
    }, []);
    

    return (
        <div>
            <Header />
            <div className="bg-light p-4">
                <Calendar
                    onDateSelect={setSelectedDate}
                    onIsPopupVisible={setIsPopupVisible}
                />
                <Meetings meetings={meetings}/>
            </div>
            {isPopupVisible &&
                <Popup
                    date={selectedDate}
                    meetings={meetings.filter(meeting => meeting.date === selectedDate)}
                    onClose={() => setIsPopupVisible(false)}
                />
            }
        </div>
    )
}