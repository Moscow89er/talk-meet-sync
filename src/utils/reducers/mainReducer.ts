import { MainState, MainAction } from "../types/stateTypes";
import {
  SET_SELECTED_DATE,
  SET_LOADING, SET_ERROR,
  SET_INFO_TOOLTIP_OPEN,
  SET_TITLE
} from "../constants/constants";

export default function mainReducer(state: MainState, action: MainAction): MainState {
    switch (action.type) {
      case SET_SELECTED_DATE:
        return { ...state, selectedDate: action.payload };
      case SET_LOADING:
        return { ...state, isLoading: action.payload };
      case SET_ERROR:
        return { ...state, isError: action.payload };
      case SET_INFO_TOOLTIP_OPEN:
        return { ...state, isInfoTooltipOpen: action.payload };
      case SET_TITLE:
        return { ...state, title: action.payload };
      default:
        throw new Error("Неподдерживаемый тип action");
    }
}