export const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions) => {
    const date = new Date(dateString);
    // Опускаем timeZone, чтобы использовать локальные настройки пользователя
    const formatter = new Intl.DateTimeFormat('ru-RU', { ...options });
    return formatter.format(date);
};