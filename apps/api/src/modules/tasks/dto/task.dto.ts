import { InputType, Field, ArgsType, Int } from '@nestjs/graphql';
import { TaskStatus, TaskPriority } from '@prisma/client';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class CreateTaskInput {
  @Field()
  @MaxLength(255)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;

  @Field(() => TaskPriority, { nullable: true })
  priority?: TaskPriority;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  projectId?: string;
}

@InputType()
export class UpdateTaskInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;

  @Field(() => TaskPriority, { nullable: true })
  priority?: TaskPriority;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  projectId?: string;
}

@ArgsType()
export class TasksArgs {
  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;

  @Field(() => TaskPriority, { nullable: true })
  priority?: TaskPriority;

  @Field({ nullable: true })
  projectId?: string;

  @Field({ nullable: true, defaultValue: 'createdAt' })
  sortBy?: string;

  @Field({ nullable: true, defaultValue: 'desc' })
  sortOrder?: 'asc' | 'desc';

  @Field({ nullable: true })
  cursor?: string;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  take?: number;
}
