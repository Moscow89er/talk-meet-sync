import { Meeting } from "./commonTypes";
import { ApiSettings } from "./apiTypes";

export interface DateRange {
    startDate: string;
    endDate: string;
}

export interface CalendarDateRangeState {
    displayDateRange: DateRange;
    requestedDateRange: Date | null;
}

export interface sortAndIdentifyOverlaps {
    action: "SORT_AND_IDENTIFY_OVERLAPS";
    data: {
      meetings: Meeting[];
      numsOfLicence: number;
    };
}

export type DateRangeAction = 
    | { type: "SET_REQUEST_DATE_CHANGE"; newDate: Date }
    | { type: "SET_APPLY_DATE_CHANGE"; newDates: { startDate: string; endDate: string } };

export type MainAction =
    | { type: "SET_SELECTED_DATE"; payload: string | null }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: boolean }
    | { type: "SET_INFO_TOOLTIP_OPEN"; payload: boolean }
    | { type: "SET_TITLE"; payload: string };

export interface MainState {
    selectedDate: string | null;
    isLoading: boolean;
    isError: boolean;
    isInfoTooltipOpen: boolean;
    title: string;
}

export type MeetingsAction = 
    | { type: "SET_MEETINGS"; payload: Meeting[] }
    | { type: "SET_OVERLAPPING_MEETINGS"; payload: Meeting[] };

export interface MeetingsState {
    meetings: Meeting[];
    overlappingMeetings: Meeting[];
}

export type ApiAction =
    | { type: "SET_API_SETTINGS"; payload: ApiSettings }
    | { type: "RESET_API_SETTINGS" };

export interface ApiState {
    apiSettings: ApiSettings;
}