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
    hasSettings: Boolean;
    isError: Boolean;
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
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

export interface MeetingsPopupProps {
    date: string;
    meetings: Meeting[];
}

export interface SettingsPopupProps {
    onSave: (newTalkUrl: string, newApiKey: string, newNumsOfLicense: number) => void;
    talkUrl: string;
    apiKey: string;
    numsOfLicense: number;
    onDelete: () => void;
}

export interface InfoTooltipProps {
    isOpen: boolean;
    onClose: () => void;
    isError: boolean;
    tooltipConfirm: string;
    tooltipError: string;
}

export interface FormFieldProps {
    id: string;
    label: string;
    type: string;
    value: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}  