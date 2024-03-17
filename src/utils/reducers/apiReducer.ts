import { ApiState, ApiAction } from "../types/stateTypes";
import MainApi from "../api/MainApi";

export default function apiReducer(state: ApiState, action: ApiAction): ApiState {
    switch (action.type) {
      case "SET_API_SETTINGS":
        return { ...state, apiSettings: action.payload };
      case "RESET_API_SETTINGS":
        return { ...state, apiSettings: { talkUrl: "", apiKey: "", numsOfLicence: 1, mainApi: new MainApi({ url: "" }) } };
      default:
        throw new Error("Неподдерживаемый тип action");
    }
}