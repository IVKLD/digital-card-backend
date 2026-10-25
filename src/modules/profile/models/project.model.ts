import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Portfolio project showcase' })
export class ProjectModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { description: 'Project name' })
  name!: string;

  @Field(() => String, { description: 'Detailed project description' })
  description!: string;

  @Field(() => String, { nullable: true, description: 'Source code repository URL' })
  repoUrl?: string | null;

  @Field(() => String, { nullable: true, description: 'Live deployment URL' })
  liveUrl?: string | null;

  @Field(() => [String], { description: 'Technologies used in the project' })
  stack!: string[];

  @Field(() => ID)
  profileId!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
