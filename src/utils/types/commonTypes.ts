export interface Meeting {
    id: number;
    title: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
}

export interface Header {
    onSettingsClick: (event: React.MouseEvent) => void;
}

export interface MeetingsProps {
    overlappingMeetings: Meeting[];
}

export interface User {
    email: string;
    firstname?: string;
    surname?: string;
    avatarUrl?: string;
}

export interface CalendarProps {
    onDateSelect: (date: string) => void;
    onIsPopupVisible: (isVisible: boolean) => void;
    overlappingMeetings: string[];
    meetings: string[];
}

export interface PopupProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

export interface MeetingsPopupProps {
    date: string;
    meetings: Meeting[];
}

export interface SettingsPopupProps {
    onSave: (newTalkUrl: string, newApiKey: string) => void;
    talkUrl: string;
    apiKey: string;
}