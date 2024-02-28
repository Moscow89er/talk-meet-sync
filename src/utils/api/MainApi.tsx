import { ApiOptions, EmailCalendarParams } from "../types/apiTypes";

class MainApi {
    private _url: string;
    private _headers: HeadersInit;

    constructor(options: ApiOptions) {
        this._url = options.url;
        // Добавляем API-ключ в заголовки при создании экземпляра класса
        this._headers = {
            "Content-Type": "application/json",
            "X-Auth-Token": "",
        };
    }

    private _getQueryString(params: Record<string, any>): string {
        return Object.keys(params)
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
}

const mainApi = new MainApi({
    url: "https://khubaev.ktalk.ru/api/",
});

export default mainApi;