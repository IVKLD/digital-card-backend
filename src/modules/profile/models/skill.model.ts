import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SkillModel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  category!: string;

  @Field(() => ID)
  profileId!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
