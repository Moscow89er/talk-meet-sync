export interface ApiOptions {
    url?: string;
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