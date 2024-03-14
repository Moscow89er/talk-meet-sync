import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
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
import { Meeting, DateRange } from "../../utils/types/commonTypes";
import { handleSaveApiSettings, handleDeleteApiSettings } from "../../utils/api/apiSettingsHandlers";
import { fetchAllUsers, fetchAllMeetings } from "../../utils/api/dataFetching";
import { formatDate } from "../../utils/formatters/formatDate";
import { filterMeetingsForSelectedDate } from "../../utils/helpers/meetingHelpers";
import { getCurrentMonthDateRange, getCalendarMonthDateRange } from "../../utils/helpers/calendarHelpers";
import MainApi from "../../utils/api/MainApi";

export default function App() {
    // Состояние данных и их фильтрация
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [overlappingMeetings, setOverlappingMeetings] = useState<Meeting[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [displayDateRange, setDisplayDateRange] = useState<DateRange>(getCurrentMonthDateRange());
    const [numsOfLicence, setNumsOfLicence] = useState<number>(1);

    // Состояния UI: всплывающие окна и загрузка
    const [activePopup, setActivePopup] = useState<string | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Состояния ошибок и информационных сообщений
    const [isError, setIsError] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");

    // Состояния связанные с API и хранением данных
    const [talkUrl, setTalkUrl] = useState(localStorage.getItem("talkUrl") || "");
    const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");
    const [mainApi, setMainApi] = useState(new MainApi({ url: talkUrl }));

    // Ссылки (Refs) для неуправляемых компонентов и оптимизации
    const meetingWorkerRef = useRef<Worker | null>(null);

    // useMemo для оптимизации вычислений
    const daysWithMeetings = useMemo(() => new Set(meetings.map(m => m.date)), [meetings]);
    const daysWithOverlappingMeetings = useMemo(() => new Set(overlappingMeetings.map(m => m.date)), [overlappingMeetings]);
    const filteredMeetingsForSelectedDate = useMemo(() => filterMeetingsForSelectedDate(meetings, selectedDate), [meetings, selectedDate]);

    // useCallback для предотвращения ненужных ререндеров
    const openMeetingsPopup = useCallback(() => {
        const dateTitle = selectedDate ? `Встречи на ${formatDate(selectedDate)}` : "Выбранная встреча";
        setTitle(dateTitle);
        setActivePopup("meetings");
        setIsPopupOpen(true);
    }, [selectedDate]);
      
    const openSettingsPopup = useCallback(() => {
        setTitle("НАСТРОЙКИ");
        setActivePopup("settings");
        setIsPopupOpen(true);
    }, []);

    const handleSettingsClick = useCallback ((event: React.MouseEvent) => {
        event.preventDefault();
        openSettingsPopup();
    }, [openSettingsPopup]);

    const closePopups = useCallback(() => {
        setActivePopup(null);
        setIsInfoTooltipOpen(false);
    }, []);

    const onSaveApiSettings = useCallback((newTalkUrl: string, newApiKey: string, newNumsOfLicence: number) => {
        handleSaveApiSettings({ 
            newTalkUrl,
            newApiKey,
            newNumsOfLicence,
            setTalkUrl,
            setApiKey,
            setNumsOfLicence,
            setMainApi,
            closePopups 
        });
    }, [
        setTalkUrl,
        setApiKey,
        setNumsOfLicence,
        setMainApi,
        closePopups
    ]);

    const onDeleteApiSettings = useCallback(() => {
        handleDeleteApiSettings({
            setTalkUrl,
            setApiKey,
            setNumsOfLicence,
            setMainApi,
            setMeetings,
            setOverlappingMeetings,
            setActivePopup,
            setIsError,
            setIsInfoTooltipOpen,
        });
        
    }, [
        setTalkUrl,
        setApiKey,
        setNumsOfLicence,
        setMainApi,
        setMeetings,
        setOverlappingMeetings,
        setActivePopup,
        setIsError,
        setIsInfoTooltipOpen
    ]);

    // Обработка изменение текущего отображаемого месяца в календаре  
    const handleMonthChange = useCallback((newDisplayDate: Date) => {
        // Рассчитываем начальную и конечную даты для месяца
        const { startDate, endDate } = getCalendarMonthDateRange(newDisplayDate);
        setDisplayDateRange({ startDate, endDate });
    }, []);

    useEffect(() => {
        // Инициализация Web Worker при монтировании компонента
        const worker = new Worker(new URL("../../utils/workers/meetingWorker.ts", import.meta.url), { type: "module" });
    
        worker.onmessage = (event) => {
            const { action, data } = event.data;
            switch (action) {
                case "sortAndIdentifyOverlaps": {
                    const { sortedMeetings, overlappingMeetings } = data;
                    setMeetings(sortedMeetings);
                    setOverlappingMeetings(overlappingMeetings);
                    setIsLoading(false);
                    break;
                }
                default:
                    console.error("Received unknown action from worker");
            }
        };
    
        // Сохраняем экземпляр worker в ссылке
        meetingWorkerRef.current = worker;
    
        // Очистка при размонтировании компонента
        return () => worker.terminate();
    }, []);

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

        if (talkUrl && apiKey) {
            fetchMeetingsForUsers(mainApi, numsOfLicence, displayDateRange);
        }
    }, [talkUrl, apiKey, mainApi, numsOfLicence, displayDateRange]);

    const fetchMeetingsForUsers = async (apiInstance: MainApi, numsOfLicence: number, displayDateRange: DateRange) => {
        // Начало выполнения и установка состояния загрузки
        setIsLoading(true);
        setMeetings([]);
        setOverlappingMeetings([]);
        
        try {
            const allUsers = await fetchAllUsers(apiInstance);
            const allMeetings = await fetchAllMeetings(apiInstance, allUsers, displayDateRange);
            
            // Проверяем, инициализирован ли worker, и отправляем данные на обработку
            if (meetingWorkerRef.current) {
                meetingWorkerRef.current.postMessage({
                    action: "sortAndIdentifyOverlaps",
                    data: { meetings: allMeetings, numsOfLicence }
                });
            }
            setIsError(false);
        } catch (error) {
            console.error("Ошибка при получении данных о встречах:", error);
            setIsError(true);
            setIsInfoTooltipOpen(true);
        } finally {
            setIsLoading(false);
        }
    };
    
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
                    onMonthChange={handleMonthChange}
                />
                <Meetings
                    overlappingMeetings={overlappingMeetings}
                    hasSettings={Boolean(talkUrl) && Boolean(apiKey)}
                    isError={isError}
                    isLoading={isLoading}
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