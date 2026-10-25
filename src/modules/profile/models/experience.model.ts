import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExperienceModel {
  @Field(() => ID)
  id!: string;

  @Field()
  company!: string;

  @Field()
  position!: string;

  @Field()
  period!: string;

  @Field(() => [String])
  achievements!: string[];

  @Field(() => ID)
  profileId!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
