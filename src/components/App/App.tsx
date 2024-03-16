import React, { useEffect, useState, useMemo, useCallback, useRef, useReducer } from "react";
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
import MainApi from "../../utils/api/MainApi";
import usePopup from "../../utils/hooks/usePopup";
import { ApiSettings } from "../../utils/types/apiTypes";
import { Meeting, DateRange } from "../../utils/types/commonTypes";
import { handleSaveApiSettings, handleDeleteApiSettings } from "../../utils/api/apiSettingsHandlers";
import { fetchAllUsers, fetchAllMeetings } from "../../utils/api/dataFetching";
import { formatDate } from "../../utils/formatters/formatDate";
import { filterMeetingsForSelectedDate } from "../../utils/helpers/meetingHelpers";
import { getCurrentMonthDateRange, getCalendarMonthDateRange } from "../../utils/helpers/calendarHelpers";
import { dateRangeReducer } from "../../utils/reducers/dateRangeReducer";
import { CalendarDateRangeState } from "../../utils/types/commonTypes";

export default function App() {
    // Состояние данных и их фильтрация
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [overlappingMeetings, setOverlappingMeetings] = useState<Meeting[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Состояния ошибок, информационных сообщений и загрузки
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");

    // Состояние связанное с API и хранением данных
    const [apiSettings, setApiSettings] = useState<ApiSettings>({
        talkUrl: localStorage.getItem("talkUrl") || "",
        apiKey: localStorage.getItem("apiKey") || "",
        numsOfLicence: 1,
        mainApi: new MainApi({ url: localStorage.getItem("talkUrl") || "" }),
    });

    // Изначальное состояние диапазона дат календаря
    const calendarRangeInitState: CalendarDateRangeState = {
        displayDateRange: getCurrentMonthDateRange(),
        requestedDateRange: null,
    };

    // Ссылка для web worker
    const meetingWorkerRef = useRef<Worker | null>(null);

    // Инициализация dateRangeReducer для корректного обновления состояния диапазона дат календаря 
    const [calendarRangeState, dispatch] = useReducer(dateRangeReducer, calendarRangeInitState);

    // useMemo для оптимизации вычислений
    const daysWithMeetings = useMemo(() => new Set(meetings.map(m => m.date)), [meetings]);
    const daysWithOverlappingMeetings = useMemo(() => new Set(overlappingMeetings.map(m => m.date)), [overlappingMeetings]);
    const filteredMeetingsForSelectedDate = useMemo(() => filterMeetingsForSelectedDate(meetings, selectedDate), [meetings, selectedDate]);

    // Использование пользовательского хука для управлением попапами
    const { popupState, openPopup, closePopup } = usePopup();

    // useCallback для предотвращения ненужных ререндеров
    const openMeetingsPopup = useCallback(() => {
        const dateTitle = selectedDate ? `Встречи на ${formatDate(selectedDate)}` : "Выбранная встреча";
        setTitle(dateTitle);
        openPopup("meetings");
    }, [openPopup, selectedDate]);
      
    const openSettingsPopup = useCallback(() => {
        setTitle("НАСТРОЙКИ");
        openPopup("settings");
    }, [openPopup]);

    const closePopups = useCallback(() => {
        closePopup();
        setIsInfoTooltipOpen(false);
    }, [closePopup]);

    const onSaveApiSettings = useCallback((newTalkUrl: string, newApiKey: string, newNumsOfLicence: number) => {
        handleSaveApiSettings({ 
            newTalkUrl,
            newApiKey,
            newNumsOfLicence,
            setApiSettings,
            closePopups,
        });
    }, [
        setApiSettings,
        closePopups
    ]);

    const onDeleteApiSettings = useCallback(() => {
        handleDeleteApiSettings({
            setApiSettings,
            setMeetings,
            setOverlappingMeetings,
            closePopup,
            setIsError,
            setIsInfoTooltipOpen,
        });
        
    }, [
        setApiSettings,
        setMeetings,
        setOverlappingMeetings,
        closePopup,
        setIsError,
        setIsInfoTooltipOpen
    ]);

    // // Обработка изменение текущего отображаемого месяца в календаре  
    const handleMonthChange = useCallback((newDisplayDate: Date) => {
        dispatch({ type: "requestDateChange", newDate: newDisplayDate });
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

    // Cинхронизации состояния приложения с хранилищем данных браузера
    useEffect(() => {
        const { talkUrl, apiKey, numsOfLicence, mainApi } = apiSettings;
        // Записываем в localStorage только если значения не пустые
        if (talkUrl) localStorage.setItem("talkUrl", talkUrl);
        else localStorage.removeItem("talkUrl");
        
        if (apiKey) localStorage.setItem("apiKey", apiKey);
        else localStorage.removeItem("apiKey");

        if (talkUrl && apiKey) {
            fetchMeetingsForUsers(mainApi, numsOfLicence, calendarRangeState.displayDateRange);
        }
    }, [apiSettings, calendarRangeState.displayDateRange]);

    // Cинхронизация пользовательского выбора диапазона дат с состоянием приложения
    useEffect(() => {
        if (calendarRangeState.requestedDateRange) {
            const { startDate, endDate } = getCalendarMonthDateRange(calendarRangeState.requestedDateRange);
            dispatch({ type: "applyDateChange", newDates: { startDate, endDate }});
        }
    }, [calendarRangeState.requestedDateRange]);

    // Функция определяющая запросы к серверу
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
            <Header onSettingsClick={openSettingsPopup}/>
            <div className="content-expand bg-light p-4">
                <Calendar
                    onDateSelect={setSelectedDate}
                    onOpenPopup={openMeetingsPopup}
                    overlappingMeetings={Array.from(daysWithOverlappingMeetings)}
                    meetings={Array.from(daysWithMeetings)}
                    onMonthChange={handleMonthChange}
                />
                <Meetings
                    overlappingMeetings={overlappingMeetings}
                    hasSettings={Boolean(apiSettings.talkUrl) && Boolean(apiSettings.apiKey)}
                    isError={isError}
                    isLoading={isLoading}
                />
            </div>
            {popupState.activePopup === "meetings" && (
                <ParentPopup
                    isOpen={popupState.isPopupOpen}
                    title={title}
                    onClose={closePopups}
                >
                    <MeetingsPopup
                        date={selectedDate}
                        meetings={filteredMeetingsForSelectedDate}
                    />
                </ParentPopup>
            )}
            {popupState.activePopup === "settings" && (
                <ParentPopup
                    isOpen={popupState.isPopupOpen}
                    title={title}
                    onClose={closePopups}>
                    <SettingsPopup
                        onSave={onSaveApiSettings}
                        talkUrl={apiSettings.talkUrl}
                        apiKey={apiSettings.apiKey}
                        numsOfLicense={apiSettings.numsOfLicence}
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