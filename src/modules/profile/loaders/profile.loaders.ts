import DataLoader = require('dataloader');
import { PrismaService } from '../../../prisma/prisma.service';
import { Skill, Experience, Project } from '@prisma/client';

export interface IProfileDataLoaders {
  skillsLoader: DataLoader<string, Skill[]>;
  experienceLoader: DataLoader<string, Experience[]>;
  projectsLoader: DataLoader<string, Project[]>;
}

export function createProfileDataLoaders(
  prisma: PrismaService,
): IProfileDataLoaders {
  // Batch loader for Skills by profileId
  const skillsLoader = new DataLoader<string, Skill[]>(
    async (profileIds: readonly string[]) => {
      const skills = await prisma.skill.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { createdAt: 'asc' },
      });

      const map = new Map<string, Skill[]>();
      for (const id of profileIds) {
        map.set(id, []);
      }
      for (const skill of skills) {
        map.get(skill.profileId)?.push(skill);
      }

      return profileIds.map((id) => map.get(id) ?? []);
    },
    { cache: true },
  );

  // Batch loader for Experience by profileId
  const experienceLoader = new DataLoader<string, Experience[]>(
    async (profileIds: readonly string[]) => {
      const experiences = await prisma.experience.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { createdAt: 'asc' },
      });

      const map = new Map<string, Experience[]>();
      for (const id of profileIds) {
        map.set(id, []);
      }
      for (const exp of experiences) {
        map.get(exp.profileId)?.push(exp);
      }

      return profileIds.map((id) => map.get(id) ?? []);
    },
    { cache: true },
  );

  // Batch loader for Projects by profileId
  const projectsLoader = new DataLoader<string, Project[]>(
    async (profileIds: readonly string[]) => {
      const projects = await prisma.project.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { createdAt: 'asc' },
      });

      const map = new Map<string, Project[]>();
      for (const id of profileIds) {
        map.set(id, []);
      }
      for (const project of projects) {
        map.get(project.profileId)?.push(project);
      }

      return profileIds.map((id) => map.get(id) ?? []);
    },
    { cache: true },
  );

  return {
    skillsLoader,
    experienceLoader,
    projectsLoader,
  };
}
