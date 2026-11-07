# Kitty — план тренировок

Первый адаптивный макет личного плана тренировок на русском языке. Next.js App Router, Tailwind CSS, TypeScript; основа API на NestJS и PostgreSQL в Docker Compose.

## Что работает

- Расписание с выбором дня и переключением недель.
- Карточки тренировок, отметки упражнений, итог недели.
- Таймер отдыха на 30, 60 или 90 секунд с паузой и сбросом.
- Имя в профиле и сохранение прогресса в `localStorage` с привязкой к календарной неделе.
- Адаптивная версия с нижней навигацией на телефоне.

Упражнения — пример содержимого для макета, а не персональная программа. На скриншоте был только значок HTML-файла, поэтому визуальная часть создана заново.

## Локальный запуск

Нужен Node.js 22.12+ и npm.

```bash
npm ci
npm run dev
```

Сайт: http://localhost:3000. Для просмотра лэйаута API и БД не нужны.

```bash
npm run typecheck
npm run build
```

## Docker Compose

```bash
cp .env.example .env
docker compose up --build -d
```

- Сайт: http://localhost:3000
- API: http://localhost:3001/api/health — проверяет подключение к PostgreSQL, возвращает 503 при недоступной БД.
- PostgreSQL: `localhost:5432`, параметры в `.env`.

Контейнеры доступны только на локальном интерфейсе. Данные PostgreSQL находятся в именованном volume `kitty_postgres`.

Отдельный запуск API при работающей базе:

```bash
docker compose up -d db
npm run build --workspace @kitty/api
DATABASE_URL=postgresql://kitty:kitty_local@localhost:5432/kitty npm run start --workspace @kitty/api
```

## Структура

```text
apps/web/app/       Страницы, стили и демонстрационный план
apps/web/public/    Иконка приложения
apps/api/src/       NestJS и health endpoint с проверкой БД
compose.yaml       web + api + PostgreSQL
Dockerfile         Сборка и отдельные образы web/api
```

Пока это локальный макет: frontend не вызывает API; нет регистрации, серверного хранения тренировок и синхронизации. PostgreSQL и NestJS подготовлены для следующего этапа. Внешний хостинг и публикация не настроены.
