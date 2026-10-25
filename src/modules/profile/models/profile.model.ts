import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SkillModel } from './skill.model';
import { ExperienceModel } from './experience.model';
import { ProjectModel } from './project.model';

@ObjectType({ description: 'Specialist digital business card profile' })
export class ProfileModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { description: 'Full name' })
  name!: string;

  @Field(() => String, { description: 'Professional title / position' })
  title!: string;

  @Field(() => String, { description: 'About / bio summary' })
  bio!: string;

  @Field(() => String, { description: 'Email address' })
  email!: string;

  @Field(() => String, { description: 'Telegram contact link' })
  telegram!: string;

  @Field(() => String, { description: 'GitHub profile link' })
  github!: string;

  @Field(() => String, { description: 'Phone number' })
  phone!: string;

  @Field(() => [SkillModel], { description: 'Candidate technical skills' })
  skills!: SkillModel[];

  @Field(() => [ExperienceModel], { description: 'Career work history' })
  experience!: ExperienceModel[];

  @Field(() => [ProjectModel], { description: 'Portfolio projects' })
  projects!: ProjectModel[];

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
