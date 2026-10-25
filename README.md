# Digital Specialist Card Backend

Бэкенд цифровой визитки на NestJS, GraphQL и PostgreSQL (Prisma).

## Стек

- **Фреймворк:** NestJS 11 (TypeScript)
- **API:** GraphQL (Code-First, Apollo Server)
- **База данных:** PostgreSQL 16
- **ORM:** Prisma 6
- **Оптимизация:** DataLoader + AST inspection для решения N+1
- **Инфраструктура:** Docker / Docker Compose

---

## Быстрый запуск

### В Docker

Поднимает PostgreSQL и приложение с автоматическим накатыванием миграций и сидированием данных:

```bash
docker compose up -d --build
```

- **GraphQL Playground / Apollo Sandbox:** [http://localhost:3000/graphql](http://localhost:3000/graphql)
- **Postgres:** `localhost:5432` (`postgres:postgres`, база `digital_card`)

Остановить:
```bash
docker compose down
```

---

## Локальный запуск (без Docker)

1. Установить зависимости:
   ```bash
   npm install
   ```

2. Запустить PostgreSQL (например, через compose):
   ```bash
   docker compose up -d postgres
   ```

3. Накатить миграции и сид:
   ```bash
   npx prisma migrate dev
   npm run prisma:seed
   ```

4. Запустить dev-сервер:
   ```bash
   npm run start:dev
   ```

---

## Архитектура и оптимизация запросов (N+1)

Для связанных сущностей (`skills`, `experience`, `projects`) реализовано два уровня оптимизации:

1. **AST Field Resolution (`src/common/ast/ast-resolver.util.ts`)**: при запросе `profile` резолвер парсит запрашиваемые клиентом поля (`GraphQLResolveInfo`). Если запрошены связи, они сразу добавляются в `include` Prisma-запроса и достаются одним SQL-запросом.
2. **DataLoader (`src/modules/profile/loaders/profile.loaders.ts`)**: если обращение к связям происходит вне корневого запроса, работают per-request DataLoader'ы, которые батчат выборку (`WHERE profileId IN (...)`) в рамках тика Node.js.

В dev-режиме в консоль логируются все SQL-запросы Prisma, поэтому легко проверить число обращений к базе.

---

## Примеры GraphQL запросов

Эндпоинт: `POST /graphql` (или через Playground в браузере).

### Получить профиль со всеми данными

```graphql
query GetProfile {
  profile {
    id
    name
    title
    bio
    email
    telegram
    github
    phone
    skills {
      name
      category
    }
    experience {
      company
      position
      period
      achievements
    }
    projects {
      name
      description
      stack
      repoUrl
      liveUrl
    }
  }
}
```

### Только контакты и навыки

```graphql
query GetContactsAndSkills {
  profile {
    name
    email
    telegram
    skills {
      name
      category
    }
  }
}
```

---

## Тесты

```bash
# Unit-тесты
npm test

# E2E-тесты
npm run test:e2e

# Покрытие
npm run test:cov
```
