import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SkillModel } from './skill.model';
import { ExperienceModel } from './experience.model';
import { ProjectModel } from './project.model';

@ObjectType()
export class ProfileModel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  title!: string;

  @Field()
  bio!: string;

  @Field()
  email!: string;

  @Field()
  telegram!: string;

  @Field()
  github!: string;

  @Field()
  phone!: string;

  @Field(() => [SkillModel])
  skills!: SkillModel[];

  @Field(() => [ExperienceModel])
  experience!: ExperienceModel[];

  @Field(() => [ProjectModel])
  projects!: ProjectModel[];

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
