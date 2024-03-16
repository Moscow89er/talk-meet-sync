import { getCurrentMonthDateRange } from "../helpers/calendarHelpers"
import { CalendarDateRangeState, DateRangeAction } from "../types/commonTypes";

export function dateRangeReducer(state: CalendarDateRangeState, action: DateRangeAction) {
    switch (action.type) {
        case "SET_REQUEST_DATE_CHANGE":
            return {
                ...state,
                requestedDateRange: action.newDate
            };
        case "SET_APPLY_DATE_CHANGE":
            return {
                ...state,
                displayDateRange: getCurrentMonthDateRange(state.requestedDateRange),
                requestedDateRange: null
            };
        default:
            throw new Error("Неподдерживаемый тип action");
    }
}