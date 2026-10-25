import { Test, TestingModule } from '@nestjs/testing';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import { IGraphQLContext } from '../../common/types/graphql-context.interface';

describe('ProfileResolver', () => {
  let resolver: ProfileResolver;
  let mockProfileService: any;

  beforeEach(async () => {
    mockProfileService = {
      getProfile: jest.fn(),
      getAllProfiles: jest.fn(),
      getProfileById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileResolver,
        { provide: ProfileService, useValue: mockProfileService },
      ],
    }).compile();

    resolver = module.get<ProfileResolver>(ProfileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('queries', () => {
    it('getProfile should call service', async () => {
      const mockResult = { id: 'p1', name: 'Игорь Дробот' };
      mockProfileService.getProfile.mockResolvedValue(mockResult);

      const result = await resolver.getProfile();
      expect(result).toEqual(mockResult);
      expect(mockProfileService.getProfile).toHaveBeenCalled();
    });

    it('getProfiles should call service', async () => {
      const mockResult = [{ id: 'p1', name: 'Игорь Дробот' }];
      mockProfileService.getAllProfiles.mockResolvedValue(mockResult);

      const result = await resolver.getProfiles();
      expect(result).toEqual(mockResult);
      expect(mockProfileService.getAllProfiles).toHaveBeenCalled();
    });

    it('getProfileById should call service', async () => {
      const mockResult = { id: 'p1', name: 'Игорь Дробот' };
      mockProfileService.getProfileById.mockResolvedValue(mockResult);

      const result = await resolver.getProfileById('p1');
      expect(result).toEqual(mockResult);
      expect(mockProfileService.getProfileById).toHaveBeenCalledWith('p1');
    });
  });

  describe('resolveFields', () => {
    const parent = { id: 'p1' } as any;

    it('skills should load via DataLoader', async () => {
      const skills = [{ id: 's1', name: 'Angular' }];
      const context = {
        loaders: {
          skillsLoader: { load: jest.fn().mockResolvedValue(skills) },
        },
      } as unknown as IGraphQLContext;

      const result = await resolver.skills(parent, context);
      expect(result).toEqual(skills);
      expect(context.loaders.skillsLoader.load).toHaveBeenCalledWith('p1');
    });

    it('experience should load via DataLoader', async () => {
      const experience = [{ id: 'e1', company: 'Company' }];
      const context = {
        loaders: {
          experienceLoader: { load: jest.fn().mockResolvedValue(experience) },
        },
      } as unknown as IGraphQLContext;

      const result = await resolver.experience(parent, context);
      expect(result).toEqual(experience);
      expect(context.loaders.experienceLoader.load).toHaveBeenCalledWith('p1');
    });

    it('projects should load via DataLoader', async () => {
      const projects = [{ id: 'pr1', name: 'Project' }];
      const context = {
        loaders: {
          projectsLoader: { load: jest.fn().mockResolvedValue(projects) },
        },
      } as unknown as IGraphQLContext;

      const result = await resolver.projects(parent, context);
      expect(result).toEqual(projects);
      expect(context.loaders.projectsLoader.load).toHaveBeenCalledWith('p1');
    });
  });
});
