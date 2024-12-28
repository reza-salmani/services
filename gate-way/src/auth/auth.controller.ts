import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ForgotPasswordDto, LoginDto } from 'src/auth/auth.model.dto';
import { ForgotPasswordModel, LoginResponse } from 'src/auth/auth.model';
import { PrismaService } from 'src/bases/services/prisma-client';

@Resolver()
export class AuthResolver {
  constructor(private prismaService: PrismaService) {}

  @Mutation(() => LoginResponse, { name: 'login' })
  async Login(
    @Args({ nullable: false, name: 'loginModel', type: () => LoginDto })
    loginModel: LoginDto,
  ) {
    return '';
  }

  @Mutation(() => ForgotPasswordModel, { name: 'forgotPassword' })
  async ForgotPassword(
    @Args({
      nullable: false,
      name: 'forgotModel',
      type: () => ForgotPasswordDto,
    })
    loginModel: ForgotPasswordDto,
  ) {}
}
