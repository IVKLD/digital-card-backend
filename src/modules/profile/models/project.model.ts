import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectModel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field({ nullable: true })
  repoUrl?: string;

  @Field({ nullable: true })
  liveUrl?: string;

  @Field(() => [String])
  stack!: string[];

  @Field(() => ID)
  profileId!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
