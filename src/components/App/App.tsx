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
import dateRangeReducer from "../../utils/reducers/dateRangeReducer";
import mainReducer from "../../utils/reducers/mainReducer";
import meetingsReducer from "../../utils/reducers/meetingsReducer";
import apiReducer from "../../utils/reducers/apiReducer";
import { MainState, CalendarDateRangeState, MeetingsState, ApiState } from "../../utils/types/stateTypes";
import { formatDate } from "../../utils/formatters/formatDate";
import { filterMeetingsForSelectedDate } from "../../utils/helpers/meetingHelpers";
import { fetchMeetingsForUsers } from "../../utils/api/dataFetching";
import { getCurrentMonthDateRange, getCalendarMonthDateRange } from "../../utils/helpers/calendarHelpers";
import {
    SORT_AND_IDENTIFY_OVERLAPS,
    SET_REQUEST_DATE_CHANGE,
    SET_APPLY_DATE_CHANGE,
    SET_SELECTED_DATE,
    SET_LOADING,
    SET_ERROR,
    SET_INFO_TOOLTIP_OPEN,
    SET_TITLE,
    SET_MEETINGS,
    SET_OVERLAPPING_MEETINGS,
    SET_API_SETTINGS,
    RESET_API_SETTINGS
} from "../../utils/constants/constants";

export default function App() {
    const mainInitState: MainState = {
        selectedDate: null,
        isLoading: false,
        isError: false,
        isInfoTooltipOpen: false,
        title: "",
    };

    const apiInitState: ApiState = {
        apiSettings: {
            talkUrl: localStorage.getItem("talkUrl") || "",
            apiKey: localStorage.getItem("apiKey") || "",
            numsOfLicence: 1,
            mainApi: new MainApi({ url: localStorage.getItem("talkUrl") || "" }),
          },
    }

    const meetingsInitState: MeetingsState = {
        meetings: [],
        overlappingMeetings: [],
    }

    const calendarRangeInitState: CalendarDateRangeState = {
        displayDateRange: getCurrentMonthDateRange(),
        requestedDateRange: null,
    };

    // Инициализация состояния приложения
    const [calendarRange, calendarDispatch] = useReducer(dateRangeReducer, calendarRangeInitState);
    const [main, mainDispatch] = useReducer(mainReducer, mainInitState);
    const [meetings, meetingsDispatch] = useReducer(meetingsReducer, meetingsInitState);
    const [api, apiDispatch] = useReducer(apiReducer, apiInitState);

    const meetingWorkerRef = useRef<Worker | null>(null);

    // useMemo для оптимизации вычислений
    const daysWithMeetings = useMemo(() => new Set(meetings.meetings.map(m => m.date)), [meetings.meetings]);
    const daysWithOverlappingMeetings = useMemo(() => new Set(meetings.overlappingMeetings.map(m => m.date)), [meetings.overlappingMeetings]);
    const filteredMeetingsForSelectedDate = useMemo(() => filterMeetingsForSelectedDate(meetings.meetings, main.selectedDate), [meetings.meetings, main.selectedDate]);

    // Использование пользовательского хука для управлением попапами
    const { popup, openPopup, closePopup } = usePopup();

    // useCallback для предотвращения ненужных ререндеров
    const openMeetingsPopup = useCallback(() => {
        const dateTitle = main.selectedDate ? `Встречи на ${formatDate(main.selectedDate)}` : "Выбранная встреча";
        mainDispatch({ type: SET_TITLE, payload: dateTitle });
        openPopup("meetings");
    }, [openPopup, main.selectedDate]);
      
    const openSettingsPopup = useCallback(() => {
        mainDispatch({ type: SET_TITLE, payload: "НАСТРОЙКИ" });
        openPopup("settings");
    }, [openPopup]);
    
    const closePopups = useCallback(() => {
        closePopup();
        mainDispatch({ type: SET_INFO_TOOLTIP_OPEN, payload: false });
    }, [closePopup]);

    const onSaveApiSettings = useCallback((newTalkUrl: string, newApiKey: string, newNumsOfLicence: number) => {
        const updatedApiInstance = new MainApi({ url: newTalkUrl });
        updatedApiInstance.updateConfig({ apiKey: newApiKey });
    
        apiDispatch({ 
            type: SET_API_SETTINGS, 
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
        apiDispatch({ type: RESET_API_SETTINGS });
        meetingsDispatch({ type: SET_MEETINGS, payload: [] });
        meetingsDispatch({ type: SET_OVERLAPPING_MEETINGS, payload: [] });
        closePopups();
        mainDispatch({ type: SET_ERROR, payload: false });
        mainDispatch({ type: SET_INFO_TOOLTIP_OPEN, payload: true });
    }, [closePopups]);

    // Обработка изменение текущего отображаемого месяца в календаре  
    const handleMonthChange = useCallback((newDisplayDate: Date) => {
        calendarDispatch({ type: SET_REQUEST_DATE_CHANGE, newDate: newDisplayDate });
    }, []);

    useEffect(() => {
        // Инициализация Web Worker при монтировании компонента
        const worker = new Worker(new URL("../../utils/workers/meetingWorker.ts", import.meta.url), { type: "module" });
    
        worker.onmessage = (event) => {
            const { action, data } = event.data;
            switch (action) {
                case SORT_AND_IDENTIFY_OVERLAPS: {
                    meetingsDispatch({ type: SET_MEETINGS, payload: data.sortedMeetings });
                    meetingsDispatch({ type: SET_OVERLAPPING_MEETINGS, payload: data.overlappingMeetings });
                    mainDispatch({ type: SET_LOADING, payload: false });
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
        if (main.selectedDate != null) {
          openMeetingsPopup();
        }
    }, [main.selectedDate, openMeetingsPopup]);
    
    // Cинхронизации состояния приложения с хранилищем данных браузера
    useEffect(() => {
        const { talkUrl, apiKey, numsOfLicence, mainApi } = api.apiSettings;
        // Записываем в localStorage только если значения не пустые
        if (talkUrl) localStorage.setItem("talkUrl", talkUrl);
        else localStorage.removeItem("talkUrl");
        
        if (apiKey) localStorage.setItem("apiKey", apiKey);
        else localStorage.removeItem("apiKey");

        if (talkUrl && apiKey) {
            fetchMeetingsForUsers(mainApi, numsOfLicence, calendarRange.displayDateRange, mainDispatch, meetingsDispatch, meetingWorkerRef);
        }
    }, [api.apiSettings, calendarRange.displayDateRange]);

    // Cинхронизация пользовательского выбора диапазона дат с состоянием приложения
    useEffect(() => {
        if (calendarRange.requestedDateRange) {
            const { startDate, endDate } = getCalendarMonthDateRange(calendarRange.requestedDateRange);
            calendarDispatch({ type: SET_APPLY_DATE_CHANGE, newDates: { startDate, endDate }});
        }
    }, [calendarRange.requestedDateRange]);
    
    return (
        <div className="full-height">
            {main.isLoading && <Preloader />}
            <Header onSettingsClick={openSettingsPopup}/>
            <div className="content-expand bg-light p-4">
                <Calendar
                    onDateSelect={(date) => mainDispatch({ type: SET_SELECTED_DATE, payload: date })}
                    onOpenPopup={openMeetingsPopup}
                    overlappingMeetings={Array.from(daysWithOverlappingMeetings)}
                    meetings={Array.from(daysWithMeetings)}
                    onMonthChange={handleMonthChange}
                />
                <Meetings
                    overlappingMeetings={meetings.overlappingMeetings}
                    hasSettings={Boolean(api.apiSettings.talkUrl) && Boolean(api.apiSettings.apiKey)}
                    isError={main.isError}
                    isLoading={main.isLoading}
                />
            </div>
            {popup.activePopup === "meetings" && (
                <ParentPopup
                    isOpen={popup.isPopupOpen}
                    title={main.title}
                    onClose={closePopups}
                >
                    <MeetingsPopup
                        date={main.selectedDate}
                        meetings={filteredMeetingsForSelectedDate}
                    />
                </ParentPopup>
            )}
            {popup.activePopup === "settings" && (
                <ParentPopup
                    isOpen={popup.isPopupOpen}
                    title={main.title}
                    onClose={closePopups}>
                    <SettingsPopup
                        onSave={onSaveApiSettings}
                        talkUrl={api.apiSettings.talkUrl}
                        apiKey={api.apiSettings.apiKey}
                        numsOfLicense={api.apiSettings.numsOfLicence}
                        onDelete={onDeleteApiSettings}
                    />
                </ParentPopup>
            )}
            <InfoTooltip
                isOpen={main.isInfoTooltipOpen}
                isError={main.isError}
                onClose={closePopups}
                tooltipConfirm="Данные удалены успешно!"
                tooltipError="Введены некорректные данные. Проверьте адрес пространства Толк или ключ Api и попробуйте снова."
            />
        </div>
    );
}