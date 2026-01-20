import { ObjectType, Field } from '@nestjs/graphql';
import { Task } from '../models/task.model';

@ObjectType()
export class PaginatedTasks {
  @Field(() => [Task])
  items: Task[];

  @Field({ nullable: true })
  nextCursor?: string;

  @Field()
  hasMore: boolean;
}
