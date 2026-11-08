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

## Dokploy

Укажи ветку `main` и Compose Path `./compose.yaml`. Основная конфигурация не занимает порты сервера: сайт публикуется через прокси Dokploy.

В разделе **Domains** добавь домен, выбери сервис **web**, Container Port **3000** и путь **/**. Сохрани и выполни Deploy. Сеть и маршрутизацию для домена настраивает Dokploy.

API и PostgreSQL доступны внутри Compose-сети. API проверяет БД через `/api/health`; веб-макет пока не обращается к API.

Для `web` явно заданы `HOSTNAME=0.0.0.0` и `PORT=3000`. Healthcheck проверяет HTTP-ответ приложения внутри контейнера. В настройках домена upstream должен использовать HTTP на порту 3000; HTTPS завершается на прокси Dokploy.

Если домен возвращает **Bad Gateway**, проверь runtime-логи `web`, его health status и **Preview Compose**. Прокси и `web` должны иметь общую сеть, а домен должен быть привязан к сервису `web` и порту 3000. Записи DNS и успешной сборки недостаточно для проверки доступности приложения.

## Docker Compose локально

```bash
cp .env.example .env
docker compose -f compose.yaml -f compose.local.yaml up --build -d
```

- Сайт: http://localhost:3000
- API: http://localhost:3001/api/health — проверяет подключение к PostgreSQL, возвращает 503 при недоступной БД.
- PostgreSQL: `localhost:5432`, параметры в `.env`.

Локальный override публикует порты только на loopback-интерфейсе. При конфликте измени `WEB_PORT`, `API_PORT` или `POSTGRES_PORT` в `.env`. Данные PostgreSQL находятся в именованном volume `kitty_postgres`.

Отдельный запуск API при работающей базе:

```bash
docker compose -f compose.yaml -f compose.local.yaml up -d db
npm run build --workspace @kitty/api
DATABASE_URL=postgresql://kitty:kitty_local@localhost:5432/kitty npm run start --workspace @kitty/api
```

## Структура

```text
apps/web/app/       Страницы, стили и демонстрационный план
apps/web/public/    Иконка приложения
apps/api/src/       NestJS и health endpoint с проверкой БД
compose.yaml       web + api + PostgreSQL
compose.local.yaml Порты для локального запуска
Dockerfile         Сборка и отдельные образы web/api
```

Frontend пока не вызывает API; нет регистрации, серверного хранения тренировок и синхронизации. PostgreSQL и NestJS подготовлены для следующего этапа. Compose поддерживает развёртывание через Dokploy; домен настраивается в панели.
