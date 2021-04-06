import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Follow } from './follow.entity';

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
    firstName?: string;

    @Column({ nullable: true })
    @Field((type) => String, { nullable: true })
    lastName?: string;

    @Column()
    @Field((type) => String)
    email: string;

    @Column()
    @Field((type) => String)
    password: string;

    @Column({ type: 'enum', enum: Gender, nullable: true })
    @Field((type) => Gender, { nullable: true })
    gender?: Gender;

    @Column({ nullable: true })
    @Field((type) => String, { nullable: true })
    country?: string;

    @Column({ nullable: true })
    @Field((type) => String, { nullable: true })
    address?: string;
	
	@Field(type => [Follow], { nullable: true })
    @OneToMany((type) => Follow, (follow) => follow.following, { cascade: true })
    following: Follow[];
	
	@Field(type => [Follow])
    @OneToMany((type) => Follow, (follow) => follow.follower)
    followers: Follow[];
}