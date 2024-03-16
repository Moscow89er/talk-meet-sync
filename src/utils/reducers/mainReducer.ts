import { MeetingState, MeetingAction } from "../types/commonTypes";
import MainApi from "../api/MainApi";

export function mainReducer(state: MeetingState, action: MeetingAction): MeetingState {
    switch (action.type) {
      case "SET_MEETINGS":
        return { ...state, meetings: action.payload };
      case "SET_OVERLAPPING_MEETINGS":
        return { ...state, overlappingMeetings: action.payload };
      case "SET_SELECTED_DATE":
        return { ...state, selectedDate: action.payload };
      case "SET_LOADING":
        return { ...state, isLoading: action.payload };
      case "SET_ERROR":
        return { ...state, isError: action.payload };
      case "SET_INFO_TOOLTIP_OPEN":
        return { ...state, isInfoTooltipOpen: action.payload };
      case "SET_API_SETTINGS":
        return { ...state, apiSettings: action.payload };
      case "RESET_API_SETTINGS":
        return { ...state, apiSettings: { talkUrl: "", apiKey: "", numsOfLicence: 1, mainApi: new MainApi({ url: "" }) } };
      case "SET_TITLE":
        return { ...state, title: action.payload };
      default:
        throw new Error("Неподдерживаемый тип action");
    }
}