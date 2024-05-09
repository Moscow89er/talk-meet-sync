# talk-meet-sync
- talk-meet-sync - это веб-приложение для отслеживания встреч, которое позволяет пользователям удобно управлять своим календарем и находить пересечения в расписаниях встреч.

- talk-meet-sync is a web application for tracking meetings that allows users to conveniently manage their calendar and find overlaps in meeting schedules.

--- Демо проекта / Project Demo
[Демо проекта / Project Demo](https://moscow89er.github.io/talk-meet-sync/)

--- Подготовка к использованию / Getting Started:
Перед началом работы с веб-приложением "talk-meet-sync" выполните следующие шаги:
- Регистрация пространства: Для использования приложения вам необходимо иметь зарегистрированное пространство в [Контур Толк](https://kontur.ru/talk) .
- Выпуск API-ключа: Получите API-ключ с правами "Только чтение" для профиля и календаря вашего пространства в Толк.
- Вход в настройки: Перейдите на страницу приложения: [Демо проекта](https://moscow89er.github.io/talk-meet-sync/) , нажмите на аватар пользователя в верхнем правом углу и войдите в настройки.
- Конфигурация: Укажите ваш API-ключ, адрес пространства Толк и количество лицензий на тарифах "Профи", "Бизнес" и "Бизнес+".
- Просмотр встреч: Приложение автоматически отобразит информацию о встречах в календаре: 'Зелёный' цвет обозначает даты без пересечений встреч, 'Красный' цвет выделяет даты с пересечениями между встречами.
- Интерактивные даты: Кликните по любой дате в календаре для получения детальной информации о встречах на этот день.
- Информация о пересечениях: Ниже календаря расположен элемент с ближайшими 9 пересечениями встреч. Клик по дате предоставит подробную информацию о каждом пересечении. Для того, чтобы получить подробную информацию о пересечениях, кликните на конкретную дату в календаре.
##
Before starting with the "talk-meet-sync" web application, follow these steps:
- Register a space: You need to have a registered space in [Kontur Talk](https://kontur.ru/talk) to use the application.
- Issue an API key: Obtain a "Read-only" API key for your space's profile and calendar in Talk.
- Access settings: Go to the application page: [Project Demo](https://moscow89er.github.io/talk-meet-sync/), click on the user avatar in the top right corner, and enter settings.
- Configuration: Enter your API key, Talk space address, and the number of licenses for "Professional", "Business", and "Business+" plans.
- Viewing meetings: The application will automatically display information about the meetings in the calendar: 'Green' color indicates dates without meeting overlaps, 'Red' color highlights dates with meeting overlaps.
- Interactive dates: Click on any date in the calendar for detailed information about meetings on that day.
- Intersection information: Below the calendar is an element with the next 9 meeting intersections. Clicking on a date will provide detailed information about each intersection. To get detailed information about intersections, click on a specific date in the calendar.

--- Особенности проекта / Project Features
- SPA на React и TypeScript: Проект представляет собой одностраничное приложение (SPA), что обеспечивает мгновенный отклик интерфейса без перезагрузки страницы. Использование TypeScript добавляет строгую типизацию, улучшая поддержку кода и минимизируя потенциальные ошибки во время разработки.
- Оптимизация запросов к API: Загрузка данных происходит инкрементально, по месяцам, что снижает нагрузку на сервер и ускоряет получение нужной информации пользователем. Подробнее о механизме в файле 'dataFetching.ts'.
- Использование Web Workers: Для обработки интенсивных вычислений, таких как определение пересечений между встречами, используются Web Workers ('meetingWorker.ts'). Это позволяет не блокировать главный поток и улучшает отзывчивость приложения.
- Тестирование ключевых функций: Критически важные функции приложения протестированы с помощью Jest, что гарантирует их надёжность и корректную работу. См. файл 'test.ts' для деталей.
##
- SPA on React and TypeScript: The project is a single-page application (SPA), which provides instant interface response without page reloading. Using TypeScript adds strict typing, improving code support and minimizing potential errors during development.
- API request optimization: Data loading occurs incrementally, by month, reducing server load and speeding up user access to needed information. More about the mechanism in 'dataFetching.ts'.
- Using Web Workers: For processing intensive computations, such as determining meeting intersections, Web Workers ('meetingWorker.ts') are used. This prevents the main thread from being blocked and improves application responsiveness.
- Testing key functions: Critically important application functions are tested with Jest, ensuring their reliability and correct operation. See 'test.ts' for details.

--- Запуск проекта локально / Running the Project Locally
- Эти инструкции помогут вам запустить копию проекта на вашем локальном компьютере для разработки и тестирования.
- These instructions will help you run a copy of the project on your local computer for development and testing.

--- Предварительные условия / Prerequisites
Для запуска проекта вам понадобится Node.js и npm. Убедитесь, что они установлены на вашем компьютере:
- node --version
- npm --version
##
To run the project, you will need Node.js and npm. Make sure they are installed on your computer:
- node --version
- npm --version

--- Установка / Installation
Для начала клонируйте репозиторий:
- https://github.com/Moscow89er/talk-meet-sync.git
##
First, clone the repository:
- https://github.com/Moscow89er/talk-meet-sync.git

--- Перейдите в папку проекта и установите необходимые зависимости / Navigate to the project folder and install the necessary dependencies
- npm install

--- Запустите проект / Start the project
- npm start

--- Стиль кодирования / Coding Style
Проект следует стилю кодирования, предписанному ESLint. Убедитесь, что ваш код соответствует установленным правилам:
- npm run lint
##
The project follows the coding style prescribed by ESLint. Ensure your code complies with established rules:
- npm run lint

--- Запуск тестов / Running Tests
- npm run test

--- Развертывание / Deployment
- Информация о рекомендуемых методах развертывания проекта будет полезна для публикации приложения. Проект можно развернуть с помощью [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/), или других популярных облачных платформ для хостинга.
- Information on recommended deployment methods will be useful for publishing the application. The project can be deployed using [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/), or other popular cloud hosting platforms.

--- Использованные технологии / Technologies Used
- React
- React Hooks
- React Custom Hooks
- Bootstrap
- TypeScript
- Jest
- ESLint
- Babel
- Web Workers

--- Возможные улучшения проекта / Possible Project Improvements
- Улучшенная обработка ошибок: Реализовать детализированные сообщения об ошибках для различных сценариев запросов к серверу. Это может включать ошибки сети, неверные данные пользователя или недоступность сервиса, предоставляя пользователю ясные инструкции для их устранения.
- Расширенная валидация форм: Углубить механизмы валидации в компоненте 'Settings Popup', включая строгую проверку формата вводимых URL и API ключей.
- Тестирование на устройствах Apple: Провести комплексное тестирование функциональности и отображения сервиса на различных устройствах Apple, включая iPhone и iPad, для обеспечения его корректной работы в экосистеме iOS.
##
- Enhanced error handling: Implement detailed error messages for various server request scenarios. This could include network errors, invalid user data, or service unavailability, providing clear instructions for their resolution.
- Extended form validation: Deepen validation mechanisms in the 'Settings Popup' component, including strict checks on the format of entered URLs and API keys.
- Testing on Apple devices: Conduct comprehensive testing of the service's functionality and display on various Apple devices, including iPhone and iPad, to ensure its correct operation in the iOS ecosystem.

## Автор / Author
Хубаев Никита / Nikita Khuvaev - [GitHub](https://github.com/Moscow89er/)
