import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { GqlAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateUserInput, ChangePasswordInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  profile(@CurrentUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  updateProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateUserInput,
  ) {
    return this.usersService.updateProfile(user.id, input);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  changePassword(
    @CurrentUser() user: User,
    @Args('input') input: ChangePasswordInput,
  ) {
    return this.usersService.changePassword(user.id, input);
  }
}
