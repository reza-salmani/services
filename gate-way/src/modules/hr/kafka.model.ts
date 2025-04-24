import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PersonnelListOutput {
  @Field(() => String, { name: 'id', nullable: false })
  id: string;

  @Field(() => String, { name: 'name', nullable: false })
  name?: string;

  @Field(() => String, { name: 'family', nullable: true })
  family?: string;

  @Field(() => String, { name: 'nationalCode', nullable: true })
  nationalCode?: string;

  @Field(() => String, { name: 'birthDate', nullable: true })
  birthDate?: string;

  @Field(() => Boolean, {
    nullable: false,
    name: 'activation',
  })
  activation: boolean = false;
}
