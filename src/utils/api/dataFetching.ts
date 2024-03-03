import { User, Meeting } from "../types/commonTypes";
import { formatDate } from "../formatters/formatDate";
import MainApi from "./MainApi";

export const fetchUsers = async (mainApi: MainApi, top: number, offset?: string): Promise<{ users: User[], offset: string }> => {
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

export const fetchMeetings = async (mainApi: MainApi, email: string): Promise<Meeting[]> => {
    try {
        const params = { email };
        const response = await mainApi.getEmailCalendar(params);
        
        // Преобразование данных API в формат интерфейса Meeting
        const meetingsData = response.items.map((item: any) => ({
            id: item.id,
            title: item.subject,
            name: item.organizer.name,
            date: formatDate(item.start, { year: 'numeric', month: '2-digit', day: '2-digit' }),
            startTime: formatDate(item.start, { hour: '2-digit', minute: '2-digit' }),
            endTime: formatDate(item.end, { hour: '2-digit', minute: '2-digit' }),
        }));
        return meetingsData;
    } catch (error) {
        console.error("Ошибка при получении данных о встречах:", error);
        return [];
    }
};