import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Calendar from "../Calendar/Calendar";
import Meetings from "../Meetings/Meetings";
import "bootstrap/dist/css/bootstrap.min.css";
import mainApi from "../../utils/api/MainApi";
import { User } from "../../utils/types/commonTypes";

const API_KEY = process.env.REACT_APP_API_KEY

console.log(API_KEY);

const fetchUsers = async (top: number, offset?: string): Promise<User[]> => {
    try {
        const params = { top, offset };
        const response = await mainApi.getUsers(params);
        console.log(response); // Удалить после сборки
        // Преобразование данных API в формат интерфейса Users
        const usersData: User[] = response.users.map((user: any) => ({
            offset: offset,
            email: user.email,
            firstname: user.firstname,
            surname: user.surname,
            avatarUrl: user.avatarUrl,
        }));
        return usersData;
    } catch (error) {
        console.error("Ошибка при получении данных о пользователях:", error);
        return [];
    }
};

export default function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [offset, setOffset] = useState<string | undefined>(undefined);

    const handleFetchUsers = async () => {
        const newUsers = await fetchUsers(10, offset);
        if(newUsers.length > 0) {
            setUsers(prevUsers => [...prevUsers, ...newUsers]);
            setOffset(offset);
        }
    }

    useEffect(() => {
        handleFetchUsers();
    }, [offset]);

    return (
        <div>
            <Header />
            <div className="bg-light p-4">
                <Calendar /> 
                <Meetings />
            </div>
        </div>
    )
}