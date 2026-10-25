import {
  Resolver,
  Query,
  ResolveField,
  Parent,
  Context,
  Args,
  ID,
} from '@nestjs/graphql';
import { ProfileModel } from './models/profile.model';
import { SkillModel } from './models/skill.model';
import { ExperienceModel } from './models/experience.model';
import { ProjectModel } from './models/project.model';
import { ProfileService } from './profile.service';
import { IGraphQLContext } from '../../common/types/graphql-context.interface';
import { Profile } from '@prisma/client';

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => ProfileModel, { name: 'profile' })
  async getProfile(): Promise<Profile> {
    return this.profileService.getProfile();
  }

  @Query(() => [ProfileModel], { name: 'profiles' })
  async getProfiles(): Promise<Profile[]> {
    return this.profileService.getAllProfiles();
  }

  @Query(() => ProfileModel, { name: 'profileById', nullable: true })
  async getProfileById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Profile | null> {
    return this.profileService.getProfileById(id);
  }

  @ResolveField(() => [SkillModel])
  async skills(
    @Parent() profile: Profile,
    @Context() { loaders }: IGraphQLContext,
  ): Promise<SkillModel[]> {
    return loaders.skillsLoader.load(profile.id) as unknown as SkillModel[];
  }

  @ResolveField(() => [ExperienceModel])
  async experience(
    @Parent() profile: Profile,
    @Context() { loaders }: IGraphQLContext,
  ): Promise<ExperienceModel[]> {
    return loaders.experienceLoader.load(
      profile.id,
    ) as unknown as ExperienceModel[];
  }

  @ResolveField(() => [ProjectModel])
  async projects(
    @Parent() profile: Profile,
    @Context() { loaders }: IGraphQLContext,
  ): Promise<ProjectModel[]> {
    return loaders.projectsLoader.load(profile.id) as unknown as ProjectModel[];
  }
}
