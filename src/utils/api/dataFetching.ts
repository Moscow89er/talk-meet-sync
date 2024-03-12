import { User, Meeting } from "../types/commonTypes";
import { formatDate } from "../formatters/formatDate";
import MainApi from "./MainApi";
import { ApiResponseUser, ApiResponseMeetingItem } from "../types/apiTypes";

export const fetchUsers = async (
    mainApi: MainApi,
    top: number,
    offset?: string
): Promise<{ users: User[], offset: string }> => {
    const params = { top, offset };
    const response = await mainApi.getUsers(params);

    if (!response.users || !response.offset) {
        throw new Error("Неправильный формат ответа API");
    }

    const usersData: User[] = response.users.map((user: ApiResponseUser) => ({
        email: user.email,
        firstname: user.firstname,
        surname: user.surname,
        avatarUrl: user.avatarUrl,
    }));

    return { users: usersData, offset: response.offset };
};

export const fetchMeetings = async (
    mainApi: MainApi,
    email: string,
    startDate: string,
    endDate: string,
    take: number = 100 // Установим значение по умолчанию для параметра take, если оно не предоставлено
): Promise<Meeting[]> => {
    const params = {
        email: email,
        start: startDate,
        to: endDate,
        take: take
    };

    const response = await mainApi.getEmailCalendar(params);

    const meetingsData = response.items.map((item: ApiResponseMeetingItem) => ({
        id: item.id,
        title: item.subject,
        name: item.organizer.name,
        date: formatDate(item.start, { year: "numeric", month: "2-digit", day: "2-digit" }),
        startTime: formatDate(item.start, { hour: "2-digit", minute: "2-digit" }),
        endTime: formatDate(item.end, { hour: "2-digit", minute: "2-digit" }),
    }));
    
    return meetingsData;
};