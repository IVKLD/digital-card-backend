import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Work experience entry' })
export class ExperienceModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { description: 'Company name' })
  company!: string;

  @Field(() => String, { description: 'Job position' })
  position!: string;

  @Field(() => String, { description: 'Employment period' })
  period!: string;

  @Field(() => [String], { description: 'List of key achievements' })
  achievements!: string[];

  @Field(() => ID)
  profileId!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
