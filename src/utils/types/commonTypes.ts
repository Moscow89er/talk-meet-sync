import { ApiSettings } from "./apiTypes";

export interface Meeting {
    id: string;
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
    hasSettings: boolean;
    isError: boolean;
    isLoading: boolean;
}

export interface User {
    email: string;
    firstname?: string;
    surname?: string;
    avatarUrl?: string;
}

export interface CalendarProps {
    onDateSelect: (date: string) => void;
    onOpenPopup: (isVisible: boolean) => void;
    overlappingMeetings: string[];
    meetings: string[];
    onMonthChange: (requestedDateRange: Date) => void;
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

export interface CalendarDayProps {
    day: number;
    isPrevMonth: boolean;
    isNextMonth: boolean;
    isCurrentDay: boolean;
    onDayClick: () => void;
    displayDate: Date;
    overlappingMeetings: string[];
    meetings: string[];
}

export interface CalendarGridProps {
    displayDate: Date;
    currentDate: Date;
    overlappingMeetings: string[];
    meetings: string[];
    handleDayClick: (day: number, isCurrentMonthDay: boolean) => void;
}

export interface MeetingsListProps {
    meetings: Meeting[];
}
  
export interface sortAndIdentifyOverlaps {
    action: "sortAndIdentifyOverlaps";
    data: {
      meetings: Meeting[];
      numsOfLicence: number;
    };
}

export interface DateRange {
    startDate: string;
    endDate: string;
}

export interface CalendarDateRangeState {
    displayDateRange: DateRange;
    requestedDateRange: Date | null;
}

export type DateRangeAction = 
    | { type: "SET_REQUEST_DATE_CHANGE"; newDate: Date }
    | { type: "SET_APPLY_DATE_CHANGE"; newDates: { startDate: string; endDate: string } };

export type MainAction =
    | { type: "SET_MEETINGS"; payload: Meeting[] }
    | { type: "SET_OVERLAPPING_MEETINGS"; payload: Meeting[] }
    | { type: "SET_SELECTED_DATE"; payload: string | null }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: boolean }
    | { type: "SET_INFO_TOOLTIP_OPEN"; payload: boolean }
    | { type: "SET_API_SETTINGS"; payload: ApiSettings }
    | { type: "RESET_API_SETTINGS" }
    | { type: "SET_TITLE"; payload: string };

export interface MainState {
    meetings: Meeting[];
    overlappingMeetings: Meeting[];
    selectedDate: string | null;
    isLoading: boolean;
    isError: boolean;
    isInfoTooltipOpen: boolean;
    apiSettings: ApiSettings;
    title: string;
}