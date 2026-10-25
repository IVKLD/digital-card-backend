import { Test, TestingModule } from '@nestjs/testing';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import { GraphQLResolveInfo } from 'graphql';
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

  describe('getProfile', () => {
    it('should call profileService.getProfile with extracted relations', async () => {
      const mockResult = { id: 'p1', name: 'Игорь Дробот' };
      mockProfileService.getProfile.mockResolvedValue(mockResult);

      const fakeInfo = {
        fieldNodes: [],
        fragments: {},
      } as unknown as GraphQLResolveInfo;

      const result = await resolver.getProfile(fakeInfo);
      expect(result).toEqual(mockResult);
      expect(mockProfileService.getProfile).toHaveBeenCalled();
    });
  });

  describe('skills resolveField', () => {
    it('should return parent skills directly if already present from AST resolution', async () => {
      const parent = {
        id: 'p1',
        name: 'Игорь',
        skills: [{ id: 's1', name: 'Angular' }],
      } as any;

      const mockLoader = { load: jest.fn() };
      const context = {
        loaders: { skillsLoader: mockLoader },
      } as unknown as IGraphQLContext;

      const result = await resolver.skills(parent, context);
      expect(result).toEqual(parent.skills);
      expect(mockLoader.load).not.toHaveBeenCalled();
    });

    it('should use DataLoader if skills are not eager loaded on parent', async () => {
      const parent = {
        id: 'p1',
        name: 'Игорь',
      } as any;

      const mockLoadedSkills = [{ id: 's1', name: 'Angular' }];
      const mockLoader = { load: jest.fn().mockResolvedValue(mockLoadedSkills) };
      const context = {
        loaders: { skillsLoader: mockLoader },
      } as unknown as IGraphQLContext;

      const result = await resolver.skills(parent, context);
      expect(result).toEqual(mockLoadedSkills);
      expect(mockLoader.load).toHaveBeenCalledWith('p1');
    });
  });

  describe('experience resolveField', () => {
    it('should return parent experience directly if present', async () => {
      const parent = {
        id: 'p1',
        experience: [{ id: 'e1', company: 'Studio' }],
      } as any;

      const mockLoader = { load: jest.fn() };
      const context = {
        loaders: { experienceLoader: mockLoader },
      } as unknown as IGraphQLContext;

      const result = await resolver.experience(parent, context);
      expect(result).toEqual(parent.experience);
      expect(mockLoader.load).not.toHaveBeenCalled();
    });

    it('should use DataLoader if experience not eager loaded', async () => {
      const parent = { id: 'p1' } as any;
      const mockExp = [{ id: 'e1', company: 'Studio' }];
      const mockLoader = { load: jest.fn().mockResolvedValue(mockExp) };
      const context = {
        loaders: { experienceLoader: mockLoader },
      } as unknown as IGraphQLContext;

      const result = await resolver.experience(parent, context);
      expect(result).toEqual(mockExp);
      expect(mockLoader.load).toHaveBeenCalledWith('p1');
    });
  });

  describe('projects resolveField', () => {
    it('should return parent projects directly if present', async () => {
      const parent = {
        id: 'p1',
        projects: [{ id: 'pr1', name: 'Isotope' }],
      } as any;

      const mockLoader = { load: jest.fn() };
      const context = {
        loaders: { projectsLoader: mockLoader },
      } as unknown as IGraphQLContext;

      const result = await resolver.projects(parent, context);
      expect(result).toEqual(parent.projects);
      expect(mockLoader.load).not.toHaveBeenCalled();
    });

    it('should use DataLoader if projects not eager loaded', async () => {
      const parent = { id: 'p1' } as any;
      const mockProj = [{ id: 'pr1', name: 'Isotope' }];
      const mockLoader = { load: jest.fn().mockResolvedValue(mockProj) };
      const context = {
        loaders: { projectsLoader: mockLoader },
      } as unknown as IGraphQLContext;

      const result = await resolver.projects(parent, context);
      expect(result).toEqual(mockProj);
      expect(mockLoader.load).toHaveBeenCalledWith('p1');
    });
  });
});
