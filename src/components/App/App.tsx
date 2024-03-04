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
import { compareMeetings } from "../../utils/helpers/compareMeetings";
import { parseDate } from "../../utils/helpers/compareMeetings";
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
            return meetings.filter(meeting => 
                meeting.date === formatDate(selectedDate, { year: "numeric", month: "2-digit", day: "2-digit" })
            );
        }
        return []; // Если selectedDate не строка, возвращаем пустой массив
    }, [meetings, selectedDate]);

    const handleFetchMeetingsForAllUsers = async (apiInstance: MainApi) => {
        setIsLoading(true);
        try {
            let currentOffset: string | undefined = undefined;
            let allUsers: User[] = [];
            let hasMoreUsers = true;
        
            while (hasMoreUsers) {
                const response = await fetchUsers(apiInstance, 10, currentOffset);
                if (response.users.length > 0) {
                    allUsers = [...allUsers, ...response.users];
                    currentOffset = response.offset;
                } else {
                    hasMoreUsers = false;
                }
            }
        
            const meetingsPromises = allUsers.map(user => fetchMeetings(apiInstance, user.email));
            const meetingsResults = await Promise.all(meetingsPromises);
            const allMeetings = meetingsResults.flat();
        
            const sortedMeetings = [...allMeetings].sort(compareMeetings);
        
            let foundOverlappingMeetings: Meeting[] = [];
            const startTimeGroups: Record<string, Meeting[]> = {};

            // Группируем встречи по времени начала
            sortedMeetings.forEach(meeting => {
                const startTime = parseDate(meeting.date, meeting.startTime).getTime().toString();
                if (!startTimeGroups[startTime]) {
                    startTimeGroups[startTime] = [];
                }
                startTimeGroups[startTime].push(meeting);
            });

            // Сверяем каждую группу с numsOfLicence
            Object.keys(startTimeGroups).forEach(time => {
                if (startTimeGroups[time].length > numsOfLicence) {
                    // Если количество встреч превышает numsOfLicence, считаем все как пересекающиеся
                    foundOverlappingMeetings = foundOverlappingMeetings.concat(startTimeGroups[time]);
                }
            });
        
            setMeetings(sortedMeetings);
            setOverlappingMeetings(foundOverlappingMeetings);
        } catch(error) {
            console.error("Ошибка при получении данных о встречах:", error);
            setMeetings([]); 
            setOverlappingMeetings([]);
            setIsError(true);
            setIsInfoTooltipOpen(true);
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

    useEffect(() => {
        if (selectedDate != null) {
          openMeetingsPopup();
        }
    }, [selectedDate, openMeetingsPopup]);

    useEffect(() => {
        // Записываем в localStorage только если значения не пустые
        if (talkUrl) localStorage.setItem("talkUrl", talkUrl);
        else localStorage.removeItem("talkUrl");
        
        if (apiKey) localStorage.setItem("apiKey", apiKey);
        else localStorage.removeItem("apiKey");
    }, [talkUrl, apiKey]);

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
                <Meetings overlappingMeetings={overlappingMeetings}/>
            </div>
            {activePopup === "meetings" && (
                <ParentPopup isOpen={isPopupOpen} title={title} onClose={closePopups}>
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