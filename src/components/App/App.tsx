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
import { User, Meeting } from "../../utils/types/commonInterfaces";
import { handleSaveApiSettings, handleDeleteApiSettings } from "../../utils/api/apiSettingsHandlers";
import { fetchUsers, fetchMeetings } from "../../utils/api/dataFetching";
import { formatDate } from "../../utils/formatters/formatDate";
import { sortMeetingsByStartTime, findOverlappingMeetings, filterMeetingsForSelectedDate } from "../../utils/helpers/meetingHelpers";
import { parseDate } from "../../utils/helpers/meetingHelpers";
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

    const closePopups = useCallback(() => {
        setActivePopup(null);
        setIsInfoTooltipOpen(false);
    }, []);

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

    const handleSettingsClick = (event: React.MouseEvent) => {
        event.preventDefault();
        openSettingsPopup();
    };

    const onSaveApiSettings = useCallback((newTalkUrl: string, newApiKey: string, newNumsOfLicense: number) => {
        handleSaveApiSettings({ 
            newTalkUrl,
            newApiKey,
            newNumsOfLicense,
            setTalkUrl,
            setApiKey,
            setNumsOfLicense,
            setMainApi,
            closePopups 
        });
    }, [setTalkUrl, setApiKey, setNumsOfLicense, setMainApi, closePopups]);

    const onDeleteApiSettings = useCallback(() => {
        handleDeleteApiSettings({
            setTalkUrl,
            setApiKey,
            setNumsOfLicense,
            setMainApi,
            setMeetings,
            setOverlappingMeetings,
            setActivePopup,
            setIsError,
            setIsInfoTooltipOpen,
            });
    }, [setTalkUrl, setApiKey, setNumsOfLicense, setMainApi, setMeetings, setOverlappingMeetings, setActivePopup, setIsError, setIsInfoTooltipOpen]);

    const daysWithMeetings = useMemo(() => new Set(meetings.map(m => m.date)), [meetings]);
    const daysWithOverlappingMeetings = useMemo(() => new Set(overlappingMeetings.map(m => m.date)), [overlappingMeetings]);
    const calculatedOverlappingMeetings: Meeting[] = useMemo(() => findOverlappingMeetings(meetings, numsOfLicence), [meetings, numsOfLicence]);
    const filteredMeetingsForSelectedDate = useMemo(() => filterMeetingsForSelectedDate(meetings, selectedDate), [meetings, selectedDate]);

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
      
    const handleFetchMeetingsForAllUsers = async (apiInstance: MainApi) => {
        // Начало выполнения и установка состояния загрузки
        setIsLoading(true);
        try {
            const allUsers = await fetchAllUsers(apiInstance);
            const allMeetings = await fetchAllMeetings(apiInstance, allUsers);
            const sortedMeetings = [...allMeetings].sort(sortMeetingsByStartTime);
        
            setMeetings(sortedMeetings);
            setOverlappingMeetings(calculatedOverlappingMeetings);
            setIsError(false);
          } catch (error) {
            console.error("Ошибка при получении данных о встречах:", error);
            setMeetings([]); 
            setOverlappingMeetings([]);
            setIsError(true);
            setIsInfoTooltipOpen(true);
          } finally {
            setIsLoading(false);
          }
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
                <ParentPopup
                    isOpen={isPopupOpen}
                    title={title} onClose={closePopups}
                >
                    <MeetingsPopup
                        date={selectedDate}
                        meetings={filteredMeetingsForSelectedDate}
                    />
                </ParentPopup>
            )}
            {activePopup === "settings" && (
                <ParentPopup isOpen={isPopupOpen} title={title} onClose={closePopups}>
                    <SettingsPopup
                        onSave={onSaveApiSettings}
                        talkUrl={talkUrl}
                        apiKey={apiKey}
                        numsOfLicense={numsOfLicence}
                        onDelete={onDeleteApiSettings}
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