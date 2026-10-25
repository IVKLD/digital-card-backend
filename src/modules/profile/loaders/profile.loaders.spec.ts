import { createProfileDataLoaders } from './profile.loaders';
import { PrismaService } from '../../../prisma/prisma.service';

describe('ProfileDataLoaders', () => {
  let mockPrisma: Partial<PrismaService>;

  beforeEach(() => {
    mockPrisma = {
      skill: {
        findMany: jest.fn(),
      } as any,
      experience: {
        findMany: jest.fn(),
      } as any,
      project: {
        findMany: jest.fn(),
      } as any,
    };
  });

  it('should batch load skills for multiple profiles in a single query', async () => {
    const fakeSkills = [
      { id: 's1', name: 'Angular', category: 'Frontend', profileId: 'p1' },
      { id: 's2', name: 'NestJS', category: 'Backend', profileId: 'p1' },
      { id: 's3', name: 'React', category: 'Frontend', profileId: 'p2' },
    ];
    (mockPrisma.skill!.findMany as jest.Mock).mockResolvedValue(fakeSkills);

    const loaders = createProfileDataLoaders(mockPrisma as PrismaService);

    const [p1Skills, p2Skills, p3Skills] = await Promise.all([
      loaders.skillsLoader.load('p1'),
      loaders.skillsLoader.load('p2'),
      loaders.skillsLoader.load('p3'),
    ]);

    expect(mockPrisma.skill!.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.skill!.findMany).toHaveBeenCalledWith({
      where: { profileId: { in: ['p1', 'p2', 'p3'] } },
      orderBy: { createdAt: 'asc' },
    });

    expect(p1Skills).toHaveLength(2);
    expect(p2Skills).toHaveLength(1);
    expect(p3Skills).toHaveLength(0);
  });

  it('should batch load experiences for multiple profiles in a single query', async () => {
    const fakeExperiences = [
      { id: 'e1', company: 'Company A', position: 'Dev', period: '2023', achievements: [], profileId: 'p1' },
      { id: 'e2', company: 'Company B', position: 'Lead', period: '2024', achievements: [], profileId: 'p2' },
    ];
    (mockPrisma.experience!.findMany as jest.Mock).mockResolvedValue(fakeExperiences);

    const loaders = createProfileDataLoaders(mockPrisma as PrismaService);

    const [p1Exp, p2Exp] = await Promise.all([
      loaders.experienceLoader.load('p1'),
      loaders.experienceLoader.load('p2'),
    ]);

    expect(mockPrisma.experience!.findMany).toHaveBeenCalledTimes(1);
    expect(p1Exp).toHaveLength(1);
    expect(p2Exp).toHaveLength(1);
  });

  it('should batch load projects for multiple profiles in a single query', async () => {
    const fakeProjects = [
      { id: 'pr1', name: 'Project 1', description: 'Desc', stack: ['TS'], profileId: 'p1' },
    ];
    (mockPrisma.project!.findMany as jest.Mock).mockResolvedValue(fakeProjects);

    const loaders = createProfileDataLoaders(mockPrisma as PrismaService);

    const [p1Projects, p2Projects] = await Promise.all([
      loaders.projectsLoader.load('p1'),
      loaders.projectsLoader.load('p2'),
    ]);

    expect(mockPrisma.project!.findMany).toHaveBeenCalledTimes(1);
    expect(p1Projects).toHaveLength(1);
    expect(p2Projects).toHaveLength(0);
  });
});
