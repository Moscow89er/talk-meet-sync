export interface ApiOptions {
    url: string;
}

export interface EmailCalendarParams {
    email: string;
    start?: string;
    to?: string;
    take?: number;
}