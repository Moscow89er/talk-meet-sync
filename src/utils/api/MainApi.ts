import { ApiOptions, EmailCalendarParams, UsersParams } from "../types/apiTypes";

export default class MainApi {
    private _url: string;
    private _headers: HeadersInit;

    constructor(options: ApiOptions) {
        this._url = options.url;
        // Добавляем API-ключ в заголовки при создании экземпляра класса
        this._headers = {
            "Content-Type": "application/json",
            "X-Auth-Token": localStorage.getItem("apiKey") || "",
        };
    }

    private _getQueryString(params: Record<string, any>): string {
        return Object.keys(params)
            .filter(key => params[key] !== undefined)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    }

    public updateConfig(options: { url?: string; apiKey?: string }): void {
        if (options.url) {
            this._url = options.url;
        }
        if (options.apiKey) {
            this._headers = {
                ...this._headers,
                "X-Auth-Token": options.apiKey,
            };
        }
    }

    public getEmailCalendar(params: EmailCalendarParams): Promise<any> {
        const queryString = this._getQueryString(params);

        return fetch(`${this._url}emailCalendar/${params.email}?${queryString}`, {
            method: 'GET',
            headers: this._headers,
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Ошибка: ${response.status}`);
            })
            .catch(err => console.error(err));
    }

    public getUsers(params: UsersParams): Promise<any> {
        const queryString = this._getQueryString(params);
        return fetch(`${this._url}users/scan?${queryString}`, {
            method: 'GET',
            headers: this._headers,
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Ошибка: ${response.status}`);
            })
            .catch(err => console.error(err));
    }
}