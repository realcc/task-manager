import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { TaskStatus, TaskPriority } from '@prisma/client';

registerEnumType(TaskStatus, { name: 'TaskStatus' });
registerEnumType(TaskPriority, { name: 'TaskPriority' });

@ObjectType()
export class Task {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field(() => TaskPriority)
  priority: TaskPriority;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  projectId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
