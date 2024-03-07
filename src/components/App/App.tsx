import React, { useEffect, useState, useMemo, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "../Header/Header";
import Calendar from "../Calendar/Calendar";
import Meetings from "../Meetings/Meetings";
import ParentPopup from "../ParentPopup/ParentPopup";
import MeetingsPopup from "../MeetingsPopup/MeetingsPopup";
import SettingsPopup from "../SettingsPopup/SettingsPopup";
import InfoTooltip from "../InfoTooltip/InfoTooltip";
import Preloader from "../Preloader/Preloader";
import { User, Meeting } from "../../utils/types/commonTypes";
import { fetchUsers, fetchMeetings } from "../../utils/api/dataFetching";
import { formatDate } from "../../utils/formatters/formatDate";
import { sortMeetingsByStartTime } from "../../utils/helpers/meetingHelppers";
import { parseDate } from "../../utils/helpers/meetingHelppers";
import MainApi from "../../utils/api/MainApi";

export default function App() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [overlappingMeetings, setOverlappingMeetings] = useState<Meeting[]>([]);
    const [numsOfLicence, setNumsOfLicense] = useState<number>(1);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [activePopup, setActivePopup] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [title, setTitle] = useState("");
    const [talkUrl, setTalkUrl] = useState(localStorage.getItem("talkUrl") || "");
    const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");
    const [mainApi, setMainApi] = useState(new MainApi({
        url: talkUrl
    }));

    const handleSaveApiSettings = useCallback(async (newTalkUrl: string, newApiKey: string, newNumsOfLicense: number) => {
        try {
            localStorage.setItem("talkUrl", newTalkUrl);
            localStorage.setItem("apiKey", newApiKey);
    
            setTalkUrl(newTalkUrl);
            setApiKey(newApiKey);
            setNumsOfLicense(newNumsOfLicense);
    
            const updatedApiInstance = new MainApi({ url: newTalkUrl });
            updatedApiInstance.updateConfig({ apiKey: newApiKey });
            setMainApi(updatedApiInstance);
            closePopups();
        } catch (error) {
            console.error("Ошибка при сохранении настроек:", error);
        }
    }, []);

    const handleDeleteApiSettings = () => {
        // Проверяем, есть ли значения в localStorage перед удалением
        const isSettingsEmpty = !localStorage.getItem("talkUrl") && !localStorage.getItem("apiKey");

        if (!isSettingsEmpty) {
            localStorage.removeItem("talkUrl");
            localStorage.removeItem("apiKey");
            
            setTalkUrl("");
            setApiKey("");
            setNumsOfLicense(0);
        
            // Создание нового экземпляра MainApi с начальными настройками
            const newApiInstance = new MainApi({ url: "" });
            setMainApi(newApiInstance);

            setMeetings([]); 
            setOverlappingMeetings([]);
        
            setActivePopup(null);
            setIsError(false);
            setIsInfoTooltipOpen(true);
        }
    };

    const daysWithMeetings = useMemo(() => new Set(meetings.map(m => m.date)), [meetings]);
    const daysWithOverlappingMeetings = useMemo(() => new Set(overlappingMeetings.map(m => m.date)), [overlappingMeetings]);

    const filteredMeetingsForSelectedDate = useMemo((): Meeting[] => {
        // Убедимся, что selectedDate является строкой для корректного сравнения
        if (typeof selectedDate === "string") {
            const allMeetingsForDate =  meetings.filter(meeting => 
                meeting.date === formatDate(selectedDate, { year: "numeric", month: "2-digit", day: "2-digit" })
            );
            
            // Сортируем все встречи по времени начала
            return allMeetingsForDate.sort((a, b) =>  parseDate(a.date, a.startTime).getTime() - parseDate(b.date, b.startTime).getTime());
        }
        return []; // Если selectedDate не строка, возвращаем пустой массив
    }, [meetings, selectedDate]);

    // Функция для извлечения всех пользователей
    const fetchAllUsers = async (apiInstance: MainApi) => {
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
    const fetchAllMeetings = async (apiInstance: MainApi, users: User[]) => {
        // Параллельное извлечение данных о встречах
        const meetingsPromises = users.map(user => fetchMeetings(apiInstance, user.email));
        // Ожидаем завершения всех ассинхронных операций извлечения встреч
        const meetingsResults = await Promise.all(meetingsPromises);
        // Результат объединяем в один массив
        return meetingsResults.flat();
    };

    // Функция для создания временной шкалы всех событий начала и окончания встреч
    const createTimeLine = (meetings: Meeting[]): { time: number; type: "start" | "end"; meeting: Meeting }[] => {
        return meetings.flatMap(meeting => [
            { time: parseDate(meeting.date, meeting.startTime).getTime(), type: "start" as "start", meeting },
            { time: parseDate(meeting.date, meeting.endTime).getTime(), type: "end" as "end", meeting },
        ]).sort((a, b) => a.time - b.time || (a.type === "start" ? -1 : 1));
    };
  
    // Функция для определения всех пересекающихся встреч с учетом количества лицензий
    const findOverlappingMeetings = (meetings: Meeting[], numsOfLicence: number): Meeting[] => {
        const timeline = createTimeLine(meetings);
        let currentMeetings = 0;
        let activeMeetings = new Set<Meeting>(); // Для отслеживания активных встреч
        let overlappingMeetings = new Set<Meeting>();
      
        timeline.forEach(event => {
            if (event.type === "start") {
                activeMeetings.add(event.meeting);
                currentMeetings++;
                if (currentMeetings > numsOfLicence) {
                    // Добавляем все активные встречи, так как они теперь пересекаются
                    activeMeetings.forEach(meeting => overlappingMeetings.add(meeting));
                }
            } else {
                activeMeetings.delete(event.meeting);
                currentMeetings--;
                // Если количество активных встреч все еще пересекается, нужно обновить список пересекающихся встреч
                if (currentMeetings >= numsOfLicence) {
                    activeMeetings.forEach(meeting => overlappingMeetings.add(meeting));
                }
            }
        });
      
        return Array.from(overlappingMeetings);
    };
      
    const handleFetchMeetingsForAllUsers = async (apiInstance: MainApi) => {
        // Начало выполнения и установка состояния загрузки
        setIsLoading(true);
        try {
            const allUsers = await fetchAllUsers(apiInstance);
            const allMeetings = await fetchAllMeetings(apiInstance, allUsers);
            const sortedMeetings = [...allMeetings].sort(sortMeetingsByStartTime);
            const overlappingMeetings = findOverlappingMeetings(sortedMeetings, numsOfLicence);
        
            setMeetings(sortedMeetings);
            setOverlappingMeetings(overlappingMeetings);
            setIsError(false);
          } catch (error) {
            console.error("Ошибка при получении данных о встречах:", error);
            setMeetings([]); 
            setOverlappingMeetings([]);
            setIsError(true);
          } finally {
            setIsLoading(false);
          }
    };
    
    const openMeetingsPopup = useCallback(() => {
        setTitle(`Встречи на ${formatDate(selectedDate)}`);
        setActivePopup("meetings");
        setIsPopupOpen(true);
    }, [selectedDate]);
      
    const openSettingsPopup = useCallback(() => {
        setTitle("НАСТРОЙКИ");
        setActivePopup("settings");
        setIsPopupOpen(true);
    }, []);

    const closePopups = useCallback(() => {
        setActivePopup(null);
        setIsInfoTooltipOpen(false);
    }, []);

    const handleSettingsClick = (event: React.MouseEvent) => {
        event.preventDefault();
        openSettingsPopup();
    };

    // Автоматизируем открытие всплывающего окна в ответ на изменение выбранной даты
    useEffect(() => {
        if (selectedDate != null) {
          openMeetingsPopup();
        }
    }, [selectedDate, openMeetingsPopup]);

    // Cинхронизации состояния компонента с хранилищем данных браузера
    useEffect(() => {
        // Записываем в localStorage только если значения не пустые
        if (talkUrl) localStorage.setItem("talkUrl", talkUrl);
        else localStorage.removeItem("talkUrl");
        
        if (apiKey) localStorage.setItem("apiKey", apiKey);
        else localStorage.removeItem("apiKey");
    }, [talkUrl, apiKey]);

    // Автоматизация запросов к серверу в ответ на изменение состояния
    useEffect(() => {
        if (talkUrl && apiKey) {
            handleFetchMeetingsForAllUsers(mainApi);
        }
    }, [talkUrl, apiKey, mainApi]);
    
    return (
        <div className="full-height">
            {isLoading && <Preloader />}
            <Header onSettingsClick={handleSettingsClick}/>
            <div className="content-expand bg-light p-4">
                <Calendar
                    onDateSelect={setSelectedDate}
                    onIsPopupVisible={openMeetingsPopup}
                    overlappingMeetings={Array.from(daysWithOverlappingMeetings)}
                    meetings={Array.from(daysWithMeetings)}
                />
                <Meetings
                    overlappingMeetings={overlappingMeetings.sort((a, b) =>  parseDate(a.date, a.startTime).getTime() - parseDate(b.date, b.startTime).getTime())}
                    hasSettings={Boolean(talkUrl) && Boolean(apiKey)}
                    isError={isError}
                />
            </div>
            {activePopup === "meetings" && (
                <ParentPopup isOpen={isPopupOpen} title={title} onClose={closePopups} >
                    <MeetingsPopup date={selectedDate} meetings={filteredMeetingsForSelectedDate} />
                </ParentPopup>
            )}
            {activePopup === "settings" && (
                <ParentPopup isOpen={isPopupOpen} title={title} onClose={closePopups}>
                    <SettingsPopup
                        onSave={handleSaveApiSettings}
                        talkUrl={talkUrl}
                        apiKey={apiKey}
                        numsOfLicense={numsOfLicence}
                        onDelete={handleDeleteApiSettings}
                    />
                </ParentPopup>
            )}
            <InfoTooltip
                isOpen={isInfoTooltipOpen}
                isError={isError}
                onClose={closePopups}
                tooltipConfirm="Данные удалены успешно!"
                tooltipError="Введены некорректные данные. Проверьте адрес пространства Толк или ключ Api и попробуйте снова."
            />
        </div>
    )
}