import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Profile, Skill, Experience, Project, Prisma } from '@prisma/client';
import { ProfileRelationsSelection } from '../../common/ast/ast-resolver.util';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Builds the Prisma include object based on requested AST relations.
   */
  private buildInclude(
    relations?: ProfileRelationsSelection,
  ): Prisma.ProfileInclude | undefined {
    if (!relations) {
      return undefined;
    }

    const include: Prisma.ProfileInclude = {};
    let hasRelations = false;

    if (relations.skills) {
      include.skills = { orderBy: { createdAt: 'asc' } };
      hasRelations = true;
    }
    if (relations.experience) {
      include.experience = { orderBy: { createdAt: 'asc' } };
      hasRelations = true;
    }
    if (relations.projects) {
      include.projects = { orderBy: { createdAt: 'asc' } };
      hasRelations = true;
    }

    return hasRelations ? include : undefined;
  }

  /**
   * Retrieves the primary candidate profile (with AST-optimized relations).
   */
  async getProfile(
    relations?: ProfileRelationsSelection,
  ): Promise<Profile> {
    const include = this.buildInclude(relations);

    const profile = await this.prisma.profile.findFirst({
      include,
      orderBy: { createdAt: 'asc' },
    });

    if (!profile) {
      throw new NotFoundException(
        'Profile not found. Please run seed script (`npm run prisma:seed`).',
      );
    }

    return profile;
  }

  /**
   * Retrieves all candidate profiles (for demonstrating batch DataLoader efficiency).
   */
  async getAllProfiles(
    relations?: ProfileRelationsSelection,
  ): Promise<Profile[]> {
    const include = this.buildInclude(relations);

    return this.prisma.profile.findMany({
      include,
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Retrieves a specific profile by UUID.
   */
  async getProfileById(
    id: string,
    relations?: ProfileRelationsSelection,
  ): Promise<Profile> {
    const include = this.buildInclude(relations);

    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include,
    });

    if (!profile) {
      throw new NotFoundException(`Profile with id "${id}" not found.`);
    }

    return profile;
  }

  /**
   * Direct fetchers for fallback or standalone field queries
   */
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
