export interface Meeting {
    id: number;
    title: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
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
    children: React.ReactNode;
    onClose: () => void;
}

export interface MeetingsPopupProps {
    date: string;
    meetings: Meeting[];
    onClose: () => void;
}