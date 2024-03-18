import { Meeting } from "./commonTypes";
import { ApiSettings } from "./apiTypes";
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
} from "../constants/constants";

export interface DateRange {
    startDate: string;
    endDate: string;
}

export interface CalendarDateRangeState {
    displayDateRange: DateRange;
    requestedDateRange: Date | null;
}

export interface sortAndIdentifyOverlaps {
    action: typeof SORT_AND_IDENTIFY_OVERLAPS;
    data: {
      meetings: Meeting[];
      numsOfLicence: number;
    };
}

export type DateRangeAction = 
    | { type: typeof SET_REQUEST_DATE_CHANGE; newDate: Date }
    | { type: typeof SET_APPLY_DATE_CHANGE; newDates: { startDate: string; endDate: string } };

export type MainAction =
    | { type: typeof SET_SELECTED_DATE; payload: string | null }
    | { type: typeof SET_LOADING; payload: boolean }
    | { type: typeof SET_ERROR; payload: boolean }
    | { type: typeof SET_INFO_TOOLTIP_OPEN; payload: boolean }
    | { type: typeof SET_TITLE; payload: string };

export interface MainState {
    selectedDate: string | null;
    isLoading: boolean;
    isError: boolean;
    isInfoTooltipOpen: boolean;
    title: string;
}

export type MeetingsAction = 
    | { type: typeof SET_MEETINGS; payload: Meeting[] }
    | { type: typeof SET_OVERLAPPING_MEETINGS; payload: Meeting[] };

export interface MeetingsState {
    meetings: Meeting[];
    overlappingMeetings: Meeting[];
}

export type ApiAction =
    | { type: typeof SET_API_SETTINGS; payload: ApiSettings }
    | { type: typeof RESET_API_SETTINGS };

export interface ApiState {
    apiSettings: ApiSettings;
}