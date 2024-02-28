export interface Meeting {
    id: number;
    title: string;
    name: string;
    date: string;
    time: string;
}

export interface MeetingsProps {
    meetings: Meeting[];
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
}