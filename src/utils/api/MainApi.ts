import { ApiOptions, EmailCalendarParams, UsersParams } from "../types/apiInterfaces";

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

    // Метод для создания строки запроса из переданных параметров
    private _getQueryString(params: Record<string, any>): string {
        // Получение ключей объекта
        return Object.keys(params)
            // Фильтрация ключей
            .filter(key => params[key] !== undefined)
            // Преобразование пар ключ-значение в строки
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            // Соединение строк
            .join("&");
    }

    // Метод для проверки ответа от сервера
    private _checkResponse(response: Response) {
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(`Ошибка: ${response.status}`);
    }

    // Метод для динамического обновления конфигурации экземпляра класса
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

    // Методы для выполнения запросов
    public getEmailCalendar(params: EmailCalendarParams): Promise<any> {
        const queryString = this._getQueryString(params);

        return fetch(`${this._url}emailCalendar/${params.email}?${queryString}`, {
            method: "GET",
            headers: this._headers,
        })
            .then(this._checkResponse);
    }

    public getUsers(params: UsersParams): Promise<any> {
        const queryString = this._getQueryString(params);
        return fetch(`${this._url}users/scan?${queryString}`, {
            method: "GET",
            headers: this._headers,
        })
            .then(this._checkResponse);
    }
}