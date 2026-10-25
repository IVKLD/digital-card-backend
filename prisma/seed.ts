import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean up existing data to allow clean re-runs
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.profile.deleteMany();

  const profile = await prisma.profile.create({
    data: {
      name: 'Игорь Дробот',
      title: 'Middle Frontend / Full-stack Engineer',
      bio: 'Инженер с 4.5+ годами опыта. Специализация: Angular, React, TypeScript, прототипирование бэкенда на NestJS, real-time интерфейсы и оптимизация рендеринга.',
      email: 'cwcrampage@gmail.com',
      telegram: 'https://t.me/IVKLCD',
      github: 'https://github.com/IVKLD',
      phone: '+7 (906) 474-19-23',
      skills: {
        create: [
          // Frontend
          { name: 'Angular (13-22)', category: 'Frontend' },
          { name: 'React', category: 'Frontend' },
          { name: 'TypeScript', category: 'Frontend' },
          { name: 'Signals', category: 'Frontend' },
          { name: 'RxJS', category: 'Frontend' },
          { name: 'SCSS', category: 'Frontend' },
          { name: 'HTML5/CSS3 (BEM)', category: 'Frontend' },
          // Backend & AI
          { name: 'Node.js', category: 'Backend' },
          { name: 'NestJS', category: 'Backend' },
          { name: 'PostgreSQL', category: 'Backend' },
          { name: 'Prisma', category: 'Backend' },
          { name: 'GraphQL', category: 'Backend' },
          { name: 'WebSocket', category: 'Backend' },
          { name: 'Stripe API', category: 'Backend' },
          { name: 'LLM Integration (OpenAI, Claude)', category: 'Backend' },
          // DevOps
          { name: 'Docker', category: 'DevOps' },
          { name: 'Docker Compose', category: 'DevOps' },
          { name: 'CI/CD', category: 'DevOps' },
          { name: 'Git', category: 'DevOps' },
          { name: 'Linux/Bash', category: 'DevOps' },
        ],
      },
      experience: {
        create: [
          {
            company: 'Стартап-студия',
            position: 'Frontend Developer',
            period: 'Август 2025 — Сентябрь 2026',
            achievements: [
              'Поставил на поток запуск ~20 проектов за год (15 в проде)',
              'Сократил вывод витрин со Stripe Elements с двух недель до 2-4 дней',
              'Спроектировал и запустил SaaS с подписками за 1.5 месяца',
              'Разработал переиспользуемый модуль сессий и авторизации',
            ],
          },
          {
            company: 'Niitsuru',
            position: 'Frontend Engineer',
            period: 'Июль 2024 — Декабрь 2024',
            achievements: [
              'Разработка торгового терминала с real-time потоком данных по WebSocket',
              'Буферизация сокетов (bufferTime/sampleTime), удержание 60 FPS под нагрузкой',
              'Виртуализация длинных списков (Angular CDK Virtual Scroll)',
              'Интеграция Web3-авторизации',
            ],
          },
          {
            company: 'Arcania',
            position: 'Middle Frontend Engineer',
            period: 'Январь 2022 — Июль 2025',
            achievements: [
              'Миграция монолита с Angular 13 на 17 в монорепозитории Nx',
              'Распил бандла (3.6 МБ -> 1.2 МБ), ускорение FCP до < 1.1s',
              'Сокращение дублирования кода на 40% через shared UI-библиотеки',
            ],
          },
        ],
      },
      projects: {
        create: [
          {
            name: 'Isotope',
            description:
              'Личный сайт-портфолио на Angular 18 с собственным кастомным UI-китом, Signals и адаптивной вёрсткой на SCSS Grid/Flexbox',
            repoUrl: 'https://github.com/IVKLD/Isotope',
            liveUrl: null,
            stack: ['Angular', 'TypeScript', 'Signals', 'SCSS'],
          },
          {
            name: 'VortexDL',
            description:
              'Веб-клиент управления аудиотекой на Angular с глубокой кастомизацией компонентов Material и виртуализацией списков через RxAngular',
            repoUrl: 'https://github.com/IVKLD/VortexDL',
            liveUrl: null,
            stack: ['Angular', 'TypeScript', 'Material UI', 'RxAngular'],
          },
        ],
      },
    },
    include: {
      skills: true,
      experience: true,
      projects: true,
    },
  });

  console.log(`Seeded profile successfully: ${profile.name} (${profile.id})`);
  console.log(`Skills count: ${profile.skills.length}`);
  console.log(`Experience count: ${profile.experience.length}`);
  console.log(`Projects count: ${profile.projects.length}`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
