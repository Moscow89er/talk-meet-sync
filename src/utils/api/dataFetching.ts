import { Dispatch } from "react";
import { User, Meeting, DateRange, MainAction } from "../types/commonTypes";
import { formatDate } from "../formatters/formatDate";
import MainApi from "./MainApi";
import { ApiResponseUser, ApiResponseMeetingItem } from "../types/apiTypes";

const fetchUsers = async (
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

const fetchMeetings = async (
    mainApi: MainApi,
    email: string,
    start: string,
    to: string,
    take: number = 100 // Установим значение по умолчанию для параметра take, если оно не предоставлено
): Promise<Meeting[]> => {
    // Генерация уникального значения (текущее время в миллисекундах)
    const cacheBuster = Date.now();

    const params = {
        email,
        start,
        to,
        take,
        // Добавляем уникальный параметр для предотвращения кеширования на стороне сервера
        _: cacheBuster,
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

// Функция для извлечения всех пользователей
export const fetchAllUsers = async (apiInstance: MainApi) => {
    // Инициализация переменных
    let currentOffset: string | undefined = undefined;
    let allUsers: User[] = [];
    let hasMoreUsers = true;
    
    // Пагинационное извлечение данных о пользователях
    while (hasMoreUsers) {
        const response = await fetchUsers(apiInstance, 10, currentOffset);
        if (response.users.length > 0) {
            allUsers = [...allUsers, ...response.users];
            currentOffset = response.offset;
        } else {
            hasMoreUsers = false;
        }
    }
  
    return allUsers;
};

// Функция для извлечения всех встреч
export const fetchAllMeetings = async (apiInstance: MainApi, users: User[], displayDateRange: DateRange) => {
    const { startDate, endDate } = displayDateRange;
    // Параллельное извлечение данных о встречах
    const meetingsPromises = users.map(user => fetchMeetings(apiInstance, user.email, startDate, endDate));
    // Ожидаем завершения всех ассинхронных операций извлечения встреч
    const meetingsResults = await Promise.all(meetingsPromises);
    // Результат объединяем в один массив
    return meetingsResults.flat();
};

export const fetchMeetingsForUsers = async (
    apiInstance: MainApi,
    numsOfLicence: number,
    displayDateRange: DateRange,
    meetingDispatch: Dispatch<MainAction>,
    meetingWorkerRef: React.RefObject<Worker>
  ) => {
    meetingDispatch({ type: "SET_LOADING", payload: true });
    meetingDispatch({ type: "SET_MEETINGS", payload: [] });
    meetingDispatch({ type: "SET_OVERLAPPING_MEETINGS", payload: [] });
    
    try {
        const allUsers = await fetchAllUsers(apiInstance);
        const allMeetings = await fetchAllMeetings(apiInstance, allUsers, displayDateRange);
        
        if (meetingWorkerRef.current) {
            meetingWorkerRef.current.postMessage({
                action: "sortAndIdentifyOverlaps",
                data: { meetings: allMeetings, numsOfLicence }
            });
        }
        meetingDispatch({ type: "SET_ERROR", payload: false });
    } catch (error) {
        console.error("Ошибка при получении данных о встречах:", error);
        meetingDispatch({ type: "SET_ERROR", payload: true });
        meetingDispatch({ type: "SET_INFO_TOOLTIP_OPEN", payload: true });
    } finally {
        meetingDispatch({ type: "SET_LOADING", payload: false });
    }
};