import React, { useEffect, useState, useMemo, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "../Header/Header";
import Calendar from "../Calendar/Calendar";
import Meetings from "../Meetings/Meetings";
import Popup from "../Popup/Popup";
import MeetingsPopup from "../MeetingsPopup/MeetingsPopup";
import SettingsPopup from "../SettingsPopup/SettingsPopup";
import { User, Meeting } from "../../utils/types/commonTypes";
import { fetchUsers, fetchMeetings } from "../../utils/api/dataFetching";
import { formatDate } from "../../utils/formatters/formatDate";
import { compareMeetings } from "../../utils/helpers/compareMeetings";
import { isOverlapping } from "../../utils/helpers/compareMeetings";
import MainApi from "../../utils/api/MainApi";

export default function App() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [overlappingMeetings, setOverlappingMeetings] = useState<Meeting[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [activePopup, setActivePopup] = useState(null);
    const [title, setTitle] = useState("");
    const [talkUrl, setTalkUrl] = useState(localStorage.getItem("talkUrl") || "");
    const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");
    const [mainApi, setMainApi] = useState(new MainApi({
        url: localStorage.getItem("talkUrl") || ""
    }));

    const handleSaveApiSettings = useCallback((newTalkUrl: string, newApiKey: string) => {
        setTalkUrl(newTalkUrl);
        setApiKey(newApiKey);
        localStorage.setItem('talkUrl', newTalkUrl);
        localStorage.setItem('apiKey', newApiKey);
        const updatedApiInstance = new MainApi({
            url: talkUrl
        });
        handleFetchMeetingsForAllUsers(mainApi);
        setMainApi(updatedApiInstance);
        closePopup();
    }, []);

    const daysWithMeetings = useMemo(() => new Set(meetings.map(m => m.date)), [meetings]);
    const daysWithOverlappingMeetings = useMemo(() => new Set(overlappingMeetings.map(m => m.date)), [overlappingMeetings]);

    const filteredMeetingsForSelectedDate = useMemo((): Meeting[] => {
        // Убедимся, что selectedDate является строкой для корректного сравнения
        if (typeof selectedDate === 'string') {
            return meetings.filter(meeting => 
                meeting.date === formatDate(selectedDate, { year: 'numeric', month: '2-digit', day: '2-digit' })
            );
        }
        return []; // Если selectedDate не строка, возвращаем пустой массив
    }, [meetings, selectedDate]);

    const handleFetchMeetingsForAllUsers = async (apiInstance: MainApi) => {
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
    
        sortedMeetings.forEach((meeting, i) => {
            sortedMeetings.slice(i + 1).forEach(otherMeeting => {
                if (isOverlapping(meeting, otherMeeting)) {
                    if (!foundOverlappingMeetings.some(m => m.id === meeting.id)) {
                        foundOverlappingMeetings.push(meeting);
                    }
                    if (!foundOverlappingMeetings.some(m => m.id === otherMeeting.id)) {
                        foundOverlappingMeetings.push(otherMeeting);
                    }
                }
            });
        });
    
        setMeetings(sortedMeetings);
        setOverlappingMeetings(foundOverlappingMeetings);
    };
    
    const openMeetingsPopup = useCallback(() => {
        setTitle(`Встречи на ${formatDate(selectedDate)}`);
        setActivePopup('meetings');
    }, [selectedDate]);
      
    const openSettingsPopup = useCallback(() => {
        setTitle("НАСТРОЙКИ");
        setActivePopup('settings');
    }, []);

    const closePopup = useCallback(() => {
        setActivePopup(null);
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
        if (talkUrl && apiKey) {
            handleFetchMeetingsForAllUsers(mainApi);
        }
    }, [talkUrl, apiKey, mainApi, handleFetchMeetingsForAllUsers]);
    
    return (
        <div className="full-height">
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
            {activePopup === 'meetings' && (
                <Popup title={title} onClose={closePopup}>
                    <MeetingsPopup date={selectedDate} meetings={filteredMeetingsForSelectedDate} />
                </Popup>
            )}
            {activePopup === 'settings' && (
                <Popup title={title} onClose={closePopup}>
                    <SettingsPopup
                        onSave={() => handleSaveApiSettings(talkUrl, apiKey)}
                        talkUrl={talkUrl}
                        setTalkUrl={setTalkUrl}
                        apiKey={apiKey}
                        setApiKey={setApiKey}
                    />
                </Popup>
            )}
        </div>
    )
}