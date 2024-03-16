import { getCurrentMonthDateRange } from "../helpers/calendarHelpers"
import { CalendarDateRangeState, DateRangeAction } from "../types/commonTypes";

export function dateRangeReducer(state: CalendarDateRangeState, action: DateRangeAction) {
    switch (action.type) {
        case "requestDateChange":
            return {
                ...state,
                requestedDateRange: action.newDate
            };
        case "applyDateChange":
            return {
                ...state,
                displayDateRange: getCurrentMonthDateRange(state.requestedDateRange),
                requestedDateRange: null
            };
        default:
            throw new Error("Неподдерживаемый тип action");
    }
}