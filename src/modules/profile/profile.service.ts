import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Profile, Skill, Experience, Project } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(): Promise<Profile> {
    const profile = await this.prisma.profile.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async getAllProfiles(): Promise<Profile[]> {
    return this.prisma.profile.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async getProfileById(id: string): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(`Profile with id "${id}" not found`);
    }

    return profile;
  }

  async getSkillsByProfileId(profileId: string): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      where: { profileId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getExperienceByProfileId(profileId: string): Promise<Experience[]> {
    return this.prisma.experience.findMany({
      where: { profileId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getProjectsByProfileId(profileId: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { profileId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
