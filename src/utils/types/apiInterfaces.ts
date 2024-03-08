import MainApi from "../api/MainApi";
import { Meeting } from "./commonInterfaces";

export interface ApiOptions {
    url?: string;
}

export interface ApiSettingsArgs {
    newTalkUrl: string;
    newApiKey: string;
    newNumsOfLicense: number;
    setTalkUrl: (url: string) => void;
    setApiKey: (key: string) => void;
    setNumsOfLicense: (num: number) => void;
    setMainApi: (api: MainApi) => void;
    closePopups: () => void;
}

export interface DeleteApiSettingsArgs {
    setTalkUrl: (url: string) => void;
    setApiKey: (key: string) => void;
    setNumsOfLicense: (num: number) => void;
    setMainApi: (api: MainApi) => void;
    setMeetings: (meetings: Meeting[]) => void; // Предположим, что тип Meeting уже определен где-то
    setOverlappingMeetings: (meetings: Meeting[]) => void;
    setActivePopup: (popup: null) => void;
    setIsError: (isError: boolean) => void;
    setIsInfoTooltipOpen: (isOpen: boolean) => void;
  }

export interface EmailCalendarParams {
    email: string;
    start?: string;
    to?: string;
    take?: number;
}

export interface UsersParams {
    top: number;
    offset?: string;
    role?: string;
    includeDisabled?: boolean;
}