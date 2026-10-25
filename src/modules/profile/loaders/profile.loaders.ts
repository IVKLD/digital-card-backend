import DataLoader from 'dataloader';
import { PrismaService } from '../../../prisma/prisma.service';
import { Skill, Experience, Project } from '@prisma/client';

export interface IProfileDataLoaders {
  skillsLoader: DataLoader<string, Skill[]>;
  experienceLoader: DataLoader<string, Experience[]>;
  projectsLoader: DataLoader<string, Project[]>;
}

function groupByProfileId<T extends { profileId: string }>(
  items: T[],
  ids: readonly string[],
): T[][] {
  const map = new Map<string, T[]>(ids.map((id) => [id, []]));
  for (const item of items) {
    map.get(item.profileId)?.push(item);
  }
  return ids.map((id) => map.get(id) ?? []);
}

export function createProfileDataLoaders(
  prisma: PrismaService,
): IProfileDataLoaders {
  return {
    skillsLoader: new DataLoader(async (ids) => {
      const items = await prisma.skill.findMany({
        where: { profileId: { in: [...ids] } },
        orderBy: { createdAt: 'asc' },
      });
      return groupByProfileId(items, ids);
    }),

    experienceLoader: new DataLoader(async (ids) => {
      const items = await prisma.experience.findMany({
        where: { profileId: { in: [...ids] } },
        orderBy: { createdAt: 'asc' },
      });
      return groupByProfileId(items, ids);
    }),

    projectsLoader: new DataLoader(async (ids) => {
      const items = await prisma.project.findMany({
        where: { profileId: { in: [...ids] } },
        orderBy: { createdAt: 'asc' },
      });
      return groupByProfileId(items, ids);
    }),
  };
}
