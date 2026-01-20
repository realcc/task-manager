import { InputType, Field } from '@nestjs/graphql';
import { MaxLength, IsOptional } from 'class-validator';

@InputType()
export class CreateProjectInput {
  @Field()
  @MaxLength(100)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(500)
  description?: string;
}

@InputType()
export class UpdateProjectInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  @MaxLength(100)
  name?: string;

  @Field({ nullable: true })
  @MaxLength(500)
  description?: string;
}
