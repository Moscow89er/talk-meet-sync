import React, { useEffect, useMemo, useCallback, useRef, useReducer } from "react";
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
import { MeetingState } from "../../utils/types/commonTypes";
import { formatDate } from "../../utils/formatters/formatDate";
import { filterMeetingsForSelectedDate } from "../../utils/helpers/meetingHelpers";
import { fetchMeetingsForUsers } from "../../utils/api/dataFetching";
import { getCurrentMonthDateRange, getCalendarMonthDateRange } from "../../utils/helpers/calendarHelpers";
import { dateRangeReducer } from "../../utils/reducers/dateRangeReducer";
import { CalendarDateRangeState } from "../../utils/types/commonTypes";
import { mainReducer } from "../../utils/reducers/mainReducer";

export default function App() {
    const meetingsInitState: MeetingState = {
        meetings: [],
        overlappingMeetings: [],
        selectedDate: null,
        isLoading: false,
        isError: false,
        isInfoTooltipOpen: false,
        apiSettings: {
          talkUrl: localStorage.getItem("talkUrl") || "",
          apiKey: localStorage.getItem("apiKey") || "",
          numsOfLicence: 1,
          mainApi: new MainApi({ url: localStorage.getItem("talkUrl") || "" }),
        },
        title: "",
    };

    const calendarRangeInitState: CalendarDateRangeState = {
        displayDateRange: getCurrentMonthDateRange(),
        requestedDateRange: null,
    };

    // Инициализация состояния приложения
    const [calendarRangeState, calendarDispatch] = useReducer(dateRangeReducer, calendarRangeInitState);
    const [meetingsState, meetingDispatch] = useReducer(mainReducer, meetingsInitState);

    const meetingWorkerRef = useRef<Worker | null>(null);

    // useMemo для оптимизации вычислений
    const daysWithMeetings = useMemo(() => new Set(meetingsState.meetings.map(m => m.date)), [meetingsState.meetings]);
    const daysWithOverlappingMeetings = useMemo(() => new Set(meetingsState.overlappingMeetings.map(m => m.date)), [meetingsState.overlappingMeetings]);
    const filteredMeetingsForSelectedDate = useMemo(() => filterMeetingsForSelectedDate(meetingsState.meetings, meetingsState.selectedDate), [meetingsState.meetings, meetingsState.selectedDate]);

    // Использование пользовательского хука для управлением попапами
    const { popupState, openPopup, closePopup } = usePopup();

    // useCallback для предотвращения ненужных ререндеров
    const openMeetingsPopup = useCallback(() => {
        const dateTitle = meetingsState.selectedDate ? `Встречи на ${formatDate(meetingsState.selectedDate)}` : "Выбранная встреча";
        meetingDispatch({ type: "SET_TITLE", payload: dateTitle });
        openPopup("meetings");
    }, [openPopup, meetingsState.selectedDate]);
      
    const openSettingsPopup = useCallback(() => {
        meetingDispatch({ type: "SET_TITLE", payload: "НАСТРОЙКИ" });
        openPopup("settings");
    }, [openPopup]);
    
    const closePopups = useCallback(() => {
        closePopup();
        meetingDispatch({ type: "SET_INFO_TOOLTIP_OPEN", payload: false });
    }, [closePopup]);

    const onSaveApiSettings = useCallback((newTalkUrl: string, newApiKey: string, newNumsOfLicence: number) => {
        const updatedApiInstance = new MainApi({ url: newTalkUrl });
        updatedApiInstance.updateConfig({ apiKey: newApiKey });
    
        meetingDispatch({ 
            type: "SET_API_SETTINGS", 
            payload: { 
                talkUrl: newTalkUrl, 
                apiKey: newApiKey, 
                numsOfLicence: newNumsOfLicence,
                mainApi: updatedApiInstance
            }
        });
        closePopups();
    }, [closePopups]);

    const onDeleteApiSettings = useCallback(() => {
        meetingDispatch({ type: "RESET_API_SETTINGS" });
        meetingDispatch({ type: "SET_MEETINGS", payload: [] });
        meetingDispatch({ type: "SET_OVERLAPPING_MEETINGS", payload: [] });
        closePopups();
        meetingDispatch({ type: "SET_ERROR", payload: false });
        meetingDispatch({ type: "SET_INFO_TOOLTIP_OPEN", payload: false });
    }, [closePopups]);

    // Обработка изменение текущего отображаемого месяца в календаре  
    const handleMonthChange = useCallback((newDisplayDate: Date) => {
        calendarDispatch({ type: "SET_REQUEST_DATE_CHANGE", newDate: newDisplayDate });
    }, []);

    useEffect(() => {
        // Инициализация Web Worker при монтировании компонента
        const worker = new Worker(new URL("../../utils/workers/meetingWorker.ts", import.meta.url), { type: "module" });
    
        worker.onmessage = (event) => {
            const { action, data } = event.data;
            switch (action) {
                case "sortAndIdentifyOverlaps": {
                    meetingDispatch({ type: "SET_MEETINGS", payload: data.sortedMeetings });
                    meetingDispatch({ type: "SET_OVERLAPPING_MEETINGS", payload: data.overlappingMeetings });
                    meetingDispatch({ type: "SET_LOADING", payload: false });
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
        if (meetingsState.selectedDate != null) {
          openMeetingsPopup();
        }
    }, [meetingsState.selectedDate, openMeetingsPopup]);
    
    // Cинхронизации состояния приложения с хранилищем данных браузера
    useEffect(() => {
        const { talkUrl, apiKey, numsOfLicence, mainApi } = meetingsState.apiSettings;
        // Записываем в localStorage только если значения не пустые
        if (talkUrl) localStorage.setItem("talkUrl", talkUrl);
        else localStorage.removeItem("talkUrl");
        
        if (apiKey) localStorage.setItem("apiKey", apiKey);
        else localStorage.removeItem("apiKey");

        if (talkUrl && apiKey) {
            fetchMeetingsForUsers(mainApi, numsOfLicence, calendarRangeState.displayDateRange, meetingDispatch, meetingWorkerRef);
        }
    }, [meetingsState.apiSettings, calendarRangeState.displayDateRange]);

    // Cинхронизация пользовательского выбора диапазона дат с состоянием приложения
    useEffect(() => {
        if (calendarRangeState.requestedDateRange) {
            const { startDate, endDate } = getCalendarMonthDateRange(calendarRangeState.requestedDateRange);
            calendarDispatch({ type: "SET_APPLY_DATE_CHANGE", newDates: { startDate, endDate }});
        }
    }, [calendarRangeState.requestedDateRange]);
    
    return (
        <div className="full-height">
            {meetingsState.isLoading && <Preloader />}
            <Header onSettingsClick={openSettingsPopup}/>
            <div className="content-expand bg-light p-4">
                <Calendar
                    onDateSelect={(date) => meetingDispatch({ type: "SET_SELECTED_DATE", payload: date })}
                    onOpenPopup={openMeetingsPopup}
                    overlappingMeetings={Array.from(daysWithOverlappingMeetings)}
                    meetings={Array.from(daysWithMeetings)}
                    onMonthChange={handleMonthChange}
                />
                <Meetings
                    overlappingMeetings={meetingsState.overlappingMeetings}
                    hasSettings={Boolean(meetingsState.apiSettings.talkUrl) && Boolean(meetingsState.apiSettings.apiKey)}
                    isError={meetingsState.isError}
                    isLoading={meetingsState.isLoading}
                />
            </div>
            {popupState.activePopup === "meetings" && (
                <ParentPopup
                    isOpen={popupState.isPopupOpen}
                    title={meetingsState.title}
                    onClose={closePopups}
                >
                    <MeetingsPopup
                        date={meetingsState.selectedDate}
                        meetings={filteredMeetingsForSelectedDate}
                    />
                </ParentPopup>
            )}
            {popupState.activePopup === "settings" && (
                <ParentPopup
                    isOpen={popupState.isPopupOpen}
                    title={meetingsState.title}
                    onClose={closePopups}>
                    <SettingsPopup
                        onSave={onSaveApiSettings}
                        talkUrl={meetingsState.apiSettings.talkUrl}
                        apiKey={meetingsState.apiSettings.apiKey}
                        numsOfLicense={meetingsState.apiSettings.numsOfLicence}
                        onDelete={onDeleteApiSettings}
                    />
                </ParentPopup>
            )}
            <InfoTooltip
                isOpen={meetingsState.isInfoTooltipOpen}
                isError={meetingsState.isError}
                onClose={closePopups}
                tooltipConfirm="Данные удалены успешно!"
                tooltipError="Введены некорректные данные. Проверьте адрес пространства Толк или ключ Api и попробуйте снова."
            />
        </div>
    );
}