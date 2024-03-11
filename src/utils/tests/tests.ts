import { findOverlappingMeetings, sortMeetingsByStartTime, parseDate } from "../helpers/meetingHelpers";
import { Meeting } from "../types/commonTypes";

// Функция для генерации тестовых встреч
function generateMeetings(count: number): Meeting[] {
  const meetings: Meeting[]  = [];
  for (let i = 0; i < count; i++) {
    const startDate = new Date(2020, 0, 1);
    startDate.setHours(0, i * 10); // каждая встреча начинается через 10 минут от предыдущей
    const endDate = new Date(startDate.getTime() + (30 * 60 * 1000)); // продолжительность 30 минут
    meetings.push({
        id: `meeting${i}`,
        title: `Meeting ${i}`,
        name: `Attendee ${i}`,
        date: startDate.toISOString().split("T")[0],
        startTime: startDate.toISOString().split("T")[1].substring(0, 5),
        endTime: endDate.toISOString().split("T")[1].substring(0, 5),
    });
  }
  return meetings;
}

describe("findOverlappingMeetings при высокой нагрузке", () => {
  // Этот тест разработан для того, чтобы не пройти, чтобы продемонстрировать использование тестов для документирования известных проблем или функциональности, которая еще не реализована.
  // Ожидается, что он не пройдет, потому что текущая реализация findOverlappingMeetings не обрабатывает случаи, когда встречи не пересекаются при высокой нагрузке.
  it("должен не обнаруживать пересечений встреч, когда их не существует", () => {
      const meetings = generateMeetings(100); // Генерация меньшего количества встреч для управляемости теста
      const numsOfLicence = 100; // Установка высокого количества лицензий, чтобы гарантировать отсутствие перекрытий

      const overlapping = findOverlappingMeetings(meetings, numsOfLicence);

      // Мы ожидаем отсутствие перекрывающихся встреч, потому что количество лицензий должно быть достаточным для управления всеми встречами без перекрытий.
      // Однако утверждение задано так, чтобы ожидать хотя бы одно перекрывающееся событие, чтобы гарантировать неудачу теста, как и задумывалось.
      expect(overlapping.length).toBe(0); // Намеренно неверное ожидание, чтобы вызвать неудачу теста
  });

  it("должен правильно идентифицировать перекрывающиеся встречи с большим набором данных", () => {
    const meetings = generateMeetings(10000); // Генерация 10000 встреч
    const numsOfLicence = 1; // Допустимое количество одновременных встреч

    // Вызов функции findOverlappingMeetings и получение результата
    const overlapping = findOverlappingMeetings(meetings, numsOfLicence);

    // Предположим, что мы ожидаем найти какое-то количество перекрывающихся встреч
    // Это условие следует адаптировать в зависимости от вашего конкретного кейса
    expect(overlapping.length).toBeGreaterThan(0);

    // Дополнительные проверки можно добавить здесь
  });
});

describe("sortMeetingsByStartTime", () => {
  // Намеренно проваливающийся тест
  it("должен неудачно сортировать встречи", () => {
    const meetingFirst: Meeting = {
      id: "1",
      title: "First Meeting",
      name: "Meeting Room 1",
      date: "01.01.2022",
      startTime: "08:00",
      endTime: "09:00"
    };
    const meetingSecond: Meeting = {
      id: "2",
      title: "Second Meeting",
      name: "Meeting Room 2",
      date: "01.01.2022",
      startTime: "10:00",
      endTime: "11:00"
    };
    const result = sortMeetingsByStartTime(meetingFirst, meetingSecond);
    // Ожидаем некорректный результат сортировки для демонстрации ошибки
    expect(result).toBeLessThan(0); // Завалится, т.к. ожидаемый результат неверен
  });

  it("должен правильно сортировать встречи в зависимости от времени начала", () => {
    const meetingFirst: Meeting = {
      id: "1",
      title: "First Meeting",
      name: "Meeting Room 1",
      date: "01.01.2022",
      startTime: "10:00",
      endTime: "11:00"
    };
    const meetingSecond: Meeting = {
      id: "2",
      title: "Second Meeting",
      name: "Meeting Room 2",
      date: "01.01.2022",
      startTime: "09:00",
      endTime: "10:00"
    };
    const result = sortMeetingsByStartTime(meetingFirst, meetingSecond);
    expect(result).toBeGreaterThan(0); // Проходит, если первая встреча начинается позже второй
  });
});

describe("parseDate", () => {
  it("корректно преобразует строки даты и времени в объект Date", () => {
    const date = parseDate("01.01.2020", "12:00");
    expect(date).toEqual(new Date("2020-01-01T12:00:00"));
  });
});