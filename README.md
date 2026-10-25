# 💼 Digital Specialist Business Card — Backend (NestJS + GraphQL + Prisma)

Production-ready репозиторий бэкенда для тестового задания **«Цифровая визитка специалиста»**, разработанный на базе NestJS, GraphQL (Code-First), PostgreSQL, Prisma ORM и Docker.

---

## 🛠 Технологический стек

- **Runtime & Language**: Node.js (v20+ / v22 LTS), TypeScript (Strict mode: `strict: true`, `noImplicitAny: true`)
- **Framework**: NestJS (модульная архитектура, dependency injection, lifecycle hooks)
- **API Protocol**: GraphQL Code-First (`@nestjs/graphql`, `@nestjs/apollo`, `@apollo/server`)
- **Schema**: Автоматическая генерация в `src/schema.gql`, включен интерактивный Apollo Sandbox / Playground по адресу `/graphql`
- **Database & ORM**: PostgreSQL + Prisma ORM (миграции, типизированный клиент, dev-логирование SQL-запросов)
- **N+1 Prevention**: Двухуровневая оптимизация: **AST Field Resolution** (eager SQL joins через Prisma include) + **DataLoader** (батчинг и дедупликация запросов на уровне полей)
- **Containerization**: Docker multi-stage build + Docker Compose (автоматический прогон миграций и сидирование базы данных при старте)
- **Testing**: Jest (Unit & E2E тесты с покрытием всех слоев)

---

## 🏛 Архитектурное решение проблемы N+1

В GraphQL наивный вызов связанных коллекций (`skills`, `experience`, `projects`) для профиля или списка профилей приводит к N+1 запросам в БД. В данном решении реализована двухуровневая стратегия:

1. **AST Field Resolution (`src/common/ast/ast-resolver.util.ts`)**:
   - При выполнении корневого запроса `profile` или `profiles` резолвер инспектирует GraphQL AST (`GraphQLResolveInfo`).
   - Анализирует запрашиваемые поля (с поддержкой inline fragments и fragment spreads).
   - Если клиент запросил `skills`, `experience` или `projects`, Prisma формирует оптимизированный `include`, и данные извлекаются за **1 единственный SQL-запрос**.
   - Резолверы полей `@ResolveField()` проверяют, были ли данные уже загружены. Если да — они немедленно возвращаются без повторного обращения к БД.

2. **Per-Request DataLoaders (`src/modules/profile/loaders/profile.loaders.ts`)**:
   - Если запрос обращается к полям вне оптимизированного корневого выборщика, в игру вступают изолированные по запросу `DataLoader` (`skillsLoader`, `experienceLoader`, `projectsLoader`).
   - DataLoader агрегирует все идентификаторы профилей в рамках одного тика Event Loop и выполняет ровно **один батч-запрос** `WHERE profileId IN (...)`.

Благодаря этому количество запросов к БД при любых сценариях строго минимально и предсказуемо.

---

## 🚀 Быстрый запуск через Docker Compose

Все сервисы (PostgreSQL и API с автомиграциями и сидом) поднимаются одной командой:

```bash
docker compose up -d
```

После старта:
- **API & Apollo Sandbox**: [http://localhost:3000/graphql](http://localhost:3000/graphql)
- **PostgreSQL**: `localhost:5432` (`postgres:postgres`, DB: `digital_card`)

Остановить сервисы:
```bash
docker compose down
```

---

## 💻 Локальная разработка (без Docker)

### 1. Установка зависимостей
```bash
npm install
```

### 2. Запуск PostgreSQL
Можно поднять только БД через Docker:
```bash
docker compose up -d postgres
```

### 3. Применение миграций и сидирование
```bash
npx prisma migrate dev
npm run prisma:seed
```

### 4. Запуск приложения в режиме разработки
```bash
npm run start:dev
```
В консоли включено логирование каждого SQL-запроса Prisma (`[Prisma Query] ...`), что позволяет наглядно контролировать отсутствие N+1.

---

## 📋 GraphQL Запросы

### Получение полной визитки кандидата (GetFullProfile)

**Query:**
```graphql
query GetFullProfile {
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
      repoUrl
      liveUrl
      stack
    }
  }
}
```

**Пример ответа:**
```json
{
  "data": {
    "profile": {
      "id": "e79336cc-542e-4460-80b0-30f4e2fa7312",
      "name": "Игорь Дробот",
      "title": "Middle Frontend / Full-stack Engineer",
      "bio": "Инженер с 4.5+ годами опыта. Специализация: Angular, React, TypeScript, прототипирование бэкенда на NestJS, real-time интерфейсы и оптимизация рендеринга.",
      "email": "cwcrampage@gmail.com",
      "telegram": "https://t.me/IVKLCD",
      "github": "https://github.com/IVKLD",
      "phone": "+7 (906) 474-19-23",
      "skills": [
        { "name": "Angular (13-19)", "category": "Frontend" },
        { "name": "NestJS", "category": "Backend" },
        { "name": "Docker", "category": "DevOps" }
      ],
      "experience": [
        {
          "company": "Стартап-студия",
          "position": "Frontend Developer",
          "period": "Август 2025 — Сентябрь 2026",
          "achievements": [
            "Поставил на поток запуск ~20 проектов за год (15 в проде)",
            "Сократил вывод витрин со Stripe Elements с двух недель до 2-4 дней",
            "Спроектировал и запустил SaaS с подписками за 1.5 месяца",
            "Разработал переиспользуемый модуль сессий и авторизации"
          ]
        }
      ],
      "projects": [
        {
          "name": "Isotope",
          "description": "Личный сайт-портфолио на Angular 18 с собственным кастомным UI-китом, Signals и адаптивной вёрсткой на SCSS Grid/Flexbox",
          "repoUrl": "https://github.com/IVKLD/Isotope",
          "liveUrl": null,
          "stack": ["Angular", "TypeScript", "Signals", "SCSS"]
        }
      ]
    }
  }
}
```

---

## 🧪 Тестирование

```bash
# Запуск unit-тестов
npm run test

# Запуск e2e-тестов
npm run test:e2e

# Отчет о покрытии кода тестами
npm run test:cov
```
