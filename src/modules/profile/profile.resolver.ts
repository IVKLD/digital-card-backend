import {
  Resolver,
  Query,
  ResolveField,
  Parent,
  Context,
  Info,
  Args,
  ID,
} from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { ProfileModel } from './models/profile.model';
import { SkillModel } from './models/skill.model';
import { ExperienceModel } from './models/experience.model';
import { ProjectModel } from './models/project.model';
import { ProfileService } from './profile.service';
import { IGraphQLContext } from '../../common/types/graphql-context.interface';
import { extractRelationsFromInfo } from '../../common/ast/ast-resolver.util';
import { Profile, Skill, Experience, Project } from '@prisma/client';

type ProfileWithRelations = Profile & {
  skills?: Skill[];
  experience?: Experience[];
  projects?: Project[];
};

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => ProfileModel, {
    name: 'profile',
    description: 'Retrieves the primary specialist digital business card profile',
  })
  async getProfile(
    @Info() info: GraphQLResolveInfo,
  ): Promise<ProfileModel> {
    const relations = extractRelationsFromInfo(info);
    const profile = await this.profileService.getProfile(relations);
    return profile as unknown as ProfileModel;
  }

  @Query(() => [ProfileModel], {
    name: 'profiles',
    description: 'Retrieves all specialist profiles (demonstrates batch DataLoader deduplication)',
  })
  async getProfiles(
    @Info() info: GraphQLResolveInfo,
  ): Promise<ProfileModel[]> {
    const relations = extractRelationsFromInfo(info);
    const profiles = await this.profileService.getAllProfiles(relations);
    return profiles as unknown as ProfileModel[];
  }

  @Query(() => ProfileModel, {
    name: 'profileById',
    nullable: true,
    description: 'Retrieves a specialist profile by unique UUID',
  })
  async getProfileById(
    @Args('id', { type: () => ID }) id: string,
    @Info() info: GraphQLResolveInfo,
  ): Promise<ProfileModel | null> {
    const relations = extractRelationsFromInfo(info);
    const profile = await this.profileService.getProfileById(id, relations);
    return profile as unknown as ProfileModel;
  }

  @ResolveField(() => [SkillModel], {
    name: 'skills',
    description: 'Resolves skills either from AST eager fetch or via DataLoader batching',
  })
  async skills(
    @Parent() profile: ProfileWithRelations,
    @Context() context: IGraphQLContext,
  ): Promise<SkillModel[]> {
    // 1. AST Field Resolution: If already joined by root query, zero extra queries
    if (profile.skills && Array.isArray(profile.skills)) {
      return profile.skills as unknown as SkillModel[];
    }

    // 2. DataLoader: Batches relation requests across multiple parents into a single IN (...) query
    const skills = await context.loaders.skillsLoader.load(profile.id);
    return skills as unknown as SkillModel[];
  }

  @ResolveField(() => [ExperienceModel], {
    name: 'experience',
    description: 'Resolves work experience either from AST eager fetch or via DataLoader batching',
  })
  async experience(
    @Parent() profile: ProfileWithRelations,
    @Context() context: IGraphQLContext,
  ): Promise<ExperienceModel[]> {
    // 1. AST Field Resolution: If already joined by root query, zero extra queries
    if (profile.experience && Array.isArray(profile.experience)) {
      return profile.experience as unknown as ExperienceModel[];
    }

    // 2. DataLoader: Batches relation requests across multiple parents into a single IN (...) query
    const experience = await context.loaders.experienceLoader.load(profile.id);
    return experience as unknown as ExperienceModel[];
  }

  @ResolveField(() => [ProjectModel], {
    name: 'projects',
    description: 'Resolves projects either from AST eager fetch or via DataLoader batching',
  })
  async projects(
    @Parent() profile: ProfileWithRelations,
    @Context() context: IGraphQLContext,
  ): Promise<ProjectModel[]> {
    // 1. AST Field Resolution: If already joined by root query, zero extra queries
    if (profile.projects && Array.isArray(profile.projects)) {
      return profile.projects as unknown as ProjectModel[];
    }

    // 2. DataLoader: Batches relation requests across multiple parents into a single IN (...) query
    const projects = await context.loaders.projectsLoader.load(profile.id);
    return projects as unknown as ProjectModel[];
  }
}
