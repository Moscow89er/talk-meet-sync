import MainApi from "../api/MainApi";
import { Meeting } from "./commonTypes";

export interface ApiOptions {
    url?: string;
}

export interface ApiSettingsArgs {
    newTalkUrl: string;
    newApiKey: string;
    newNumsOfLicence: number;
    setTalkUrl: (url: string) => void;
    setApiKey: (key: string) => void;
    setNumsOfLicence: (num: number) => void;
    setMainApi: (api: MainApi) => void;
    closePopups: () => void;
}

export interface DeleteApiSettingsArgs {
    setTalkUrl: (url: string) => void;
    setApiKey: (key: string) => void;
    setNumsOfLicence: (num: number) => void;
    setMainApi: (api: MainApi) => void;
    setMeetings: (meetings: Meeting[]) => void;
    setOverlappingMeetings: (meetings: Meeting[]) => void;
    setActivePopup: (popup: null) => void;
    setIsError: (isError: boolean) => void;
    setIsInfoTooltipOpen: (isOpen: boolean) => void;
  }

export interface EmailCalendarParams {
    // Добавление индекскной подписи
    [key: string]: string | number | boolean;
    email: string;
    start?: string;
    to?: string;
    take?: number;
}

export interface EmailCalendarResponse {
    items: ApiResponseMeetingItem[];
}

export interface UsersParams {
    // Добавление индекскной подписи
    [key: string]: string | number | boolean;
    top: number;
    offset?: string;
    role?: string;
    includeDisabled?: boolean;
}

export interface ApiResponseUser {
    email: string;
    firstname: string;
    surname: string;
    avatarUrl?: string;
}

export interface ApiResponseMeetingItem {
    id: string;
    subject: string;
    organizer: {
        name: string;
    };
    start: string;
    end: string;
}

export interface ApiError {
    message: string;
}

export type ApiMethod<TParams, TResponse> = (params: TParams) => Promise<TResponse>;