import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, MinLength } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  currentPassword: string;

  @Field()
  @MinLength(8)
  newPassword: string;
}
