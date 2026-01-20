import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterInput,
  LoginInput,
  AuthPayload,
  UserType,
} from './dto/auth.dto';
import { GqlAuthGuard } from './auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthPayload)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => AuthPayload)
  refreshToken(@Args('token') token: string) {
    return this.authService.refreshTokens(token);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  logout(@CurrentUser() user: { id: string }) {
    return this.authService.logout(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserType)
  me(@CurrentUser() user: UserType) {
    return user;
  }
}
