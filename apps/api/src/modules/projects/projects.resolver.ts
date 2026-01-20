import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './models/project.model';
import { CreateProjectInput, UpdateProjectInput } from './dto/project.dto';
import { GqlAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/models/user.model';

@Resolver(() => Project)
@UseGuards(GqlAuthGuard)
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Query(() => [Project])
  projects(@CurrentUser() user: User) {
    return this.projectsService.findAll(user.id);
  }

  @Query(() => Project)
  project(@CurrentUser() user: User, @Args('id') id: string) {
    return this.projectsService.findById(id, user.id);
  }

  @Mutation(() => Project)
  createProject(
    @CurrentUser() user: User,
    @Args('input') input: CreateProjectInput,
  ) {
    return this.projectsService.create(user.id, input);
  }

  @Mutation(() => Project)
  updateProject(
    @CurrentUser() user: User,
    @Args('input') input: UpdateProjectInput,
  ) {
    return this.projectsService.update(user.id, input);
  }

  @Mutation(() => Project)
  deleteProject(@CurrentUser() user: User, @Args('id') id: string) {
    return this.projectsService.delete(user.id, id);
  }

  @ResolveField(() => Int)
  taskCount(@Parent() project: Project & { _count?: { tasks: number } }) {
    return project._count?.tasks ?? 0;
  }
}
