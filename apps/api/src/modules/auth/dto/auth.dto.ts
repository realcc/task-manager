import { Field, InputType, ObjectType, ID } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  password: string;

  @Field()
  name: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => UserType)
  user: UserType;
}
