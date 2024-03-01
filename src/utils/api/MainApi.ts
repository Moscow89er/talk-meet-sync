import { ApiOptions, EmailCalendarParams, UsersParams } from "../types/apiTypes";

class MainApi {
    private _url: string;
    private _headers: HeadersInit;

    constructor(options: ApiOptions) {
        this._url = options.url;
        // Добавляем API-ключ в заголовки при создании экземпляра класса
        this._headers = {
            "Content-Type": "application/json",
            "X-Auth-Token": process.env.REACT_APP_API_KEY,
        };
    }

    private _getQueryString(params: Record<string, any>): string {
        return Object.keys(params)
            .filter(key => params[key] !== undefined)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
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

const mainApi = new MainApi({
    url: "https://khubaev.ktalk.ru/api/",
});

export default mainApi;