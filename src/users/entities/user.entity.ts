import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';

export enum Gender {
  MALE,
  FEMALE,
}

registerEnumType(Gender, {
  name: 'userGender',
});

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  firstName: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  lastName: string;

  @Column()
  @Field((type) => String)
  email: string;

  @Column()
  @Field((type) => String)
  password: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  @Field((type) => Gender, { nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  country: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  address: string;
}
