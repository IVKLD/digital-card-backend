import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Skill item representing candidate technical competency' })
export class SkillModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { description: 'Skill name or technology title' })
  name!: string;

  @Field(() => String, { description: 'Skill category (Frontend, Backend, DevOps, Tools)' })
  category!: string;

  @Field(() => ID)
  profileId!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
