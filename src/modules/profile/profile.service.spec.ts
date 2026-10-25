import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProfileService', () => {
  let service: ProfileService;
  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      profile: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      skill: { findMany: jest.fn() },
      experience: { findMany: jest.fn() },
      project: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return profile when found', async () => {
      const mockProfile = { id: 'p1', name: 'Игорь Дробот' };
      mockPrisma.profile.findFirst.mockResolvedValue(mockProfile);

      const result = await service.getProfile({ skills: true, experience: false, projects: false });
      expect(result).toEqual(mockProfile);
      expect(mockPrisma.profile.findFirst).toHaveBeenCalledWith({
        include: { skills: { orderBy: { createdAt: 'asc' } } },
        orderBy: { createdAt: 'asc' },
      });
    });

    it('should throw NotFoundException when profile is not in database', async () => {
      mockPrisma.profile.findFirst.mockResolvedValue(null);

      await expect(service.getProfile()).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllProfiles', () => {
    it('should return all profiles', async () => {
      const mockProfiles = [{ id: 'p1', name: 'Игорь Дробот' }];
      mockPrisma.profile.findMany.mockResolvedValue(mockProfiles);

      const result = await service.getAllProfiles();
      expect(result).toEqual(mockProfiles);
    });
  });

  describe('getProfileById', () => {
    it('should return profile by id', async () => {
      const mockProfile = { id: 'p1', name: 'Игорь Дробот' };
      mockPrisma.profile.findUnique.mockResolvedValue(mockProfile);

      const result = await service.getProfileById('p1');
      expect(result).toEqual(mockProfile);
    });

    it('should throw NotFoundException if id does not exist', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(null);

      await expect(service.getProfileById('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
