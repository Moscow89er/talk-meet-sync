# talk-meet-synk

talk-meet-synk - это веб-приложение для отслеживания встреч, которое позволяет пользователям удобно управлять своим календарем и находить пересечения в расписаниях встреч.

## Начало работы
Эти инструкции помогут вам запустить копию проекта на вашем локальном компьютере для разработки и тестирования.

## Предварительные условия
Для запуска проекта вам понадобится Node.js и npm. Убедитесь, что они установлены на вашем компьютере.
node --version
npm --version

## Установка
Для начала клонируйте репозиторий
https://github.com/Moscow89er/talk-meet-sync.git

## Перейдите в папку проекта и установите необходимые зависимости
cd talk-meet-synk
npm install

## Запустите проект:
npm start

## Стиль кодирования
Проект следует стилю кодирования, предписанному ESLint и Prettier. Убедитесь, что ваш код соответствует установленным правилам:
npm run lint

## Развертывание
Проект можно развернуть с помощью стандартных средств для вашего хостинга.

## Использованные инструменты
React - библиотека для пользовательского интерфейса
Bootstrap - для стилей и адаптивного дизайна
TypeScript - типизированная надстройка над JavaScript

## Структура проекта
talk-meet-synk

├─ src
│  ├─ components
│  │  ├─ App
│  │  ├─ Calendar
│  │  ├─ Header
│  │  ├─ Meetings
│  │  └─ Popup
│  ├─ utils
│  │  ├─ api
│  │  ├─ constants
│  │  ├─ formatters
│  │  ├─ helpers
│  │  └─ types
├─ public
│  └─ index.html
└─ ...

## Автор
Хубаев Никита - https://github.com/Moscow89er/