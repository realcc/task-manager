import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './models/task.model';
import { PaginatedTasks } from './dto/paginated-tasks';
import { CreateTaskInput, UpdateTaskInput, TasksArgs } from './dto/task.dto';
import { GqlAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/models/user.model';

@Resolver(() => Task)
@UseGuards(GqlAuthGuard)
export class TasksResolver {
  constructor(private tasksService: TasksService) {}

  @Query(() => PaginatedTasks)
  tasks(@CurrentUser() user: User, @Args() args: TasksArgs) {
    return this.tasksService.findAll(user.id, args);
  }

  @Query(() => Task)
  task(@CurrentUser() user: User, @Args('id') id: string) {
    return this.tasksService.findById(id, user.id);
  }

  @Mutation(() => Task)
  createTask(@CurrentUser() user: User, @Args('input') input: CreateTaskInput) {
    return this.tasksService.create(user.id, input);
  }

  @Mutation(() => Task)
  updateTask(@CurrentUser() user: User, @Args('input') input: UpdateTaskInput) {
    return this.tasksService.update(user.id, input);
  }

  @Mutation(() => Task)
  deleteTask(@CurrentUser() user: User, @Args('id') id: string) {
    return this.tasksService.delete(user.id, id);
  }
}
