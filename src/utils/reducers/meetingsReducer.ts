import { SET_MEETINGS, SET_OVERLAPPING_MEETINGS } from "../constants/constants";
import { MeetingsState, MeetingsAction } from "../types/stateTypes";

export default function meetingsReducer(state: MeetingsState, action: MeetingsAction): MeetingsState {
    switch (action.type) {
    case SET_MEETINGS:
        return { ...state, meetings: action.payload };
    case SET_OVERLAPPING_MEETINGS:
        return { ...state, overlappingMeetings: action.payload };
    default:
        throw new Error("Неподдерживаемый тип action");
    }
}