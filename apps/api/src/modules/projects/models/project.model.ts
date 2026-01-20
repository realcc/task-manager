import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Task } from '../../tasks/models/task.model';

@ObjectType()
export class Project {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Task], { nullable: true })
  tasks?: Task[];

  @Field(() => Int)
  taskCount?: number;
}
