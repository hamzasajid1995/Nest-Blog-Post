import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DoesUserExist } from 'src/core/guards/doesUserExist.guard';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signin(@Request() req) {
    return await this.authService.signin(req.user);
  }

  @UseGuards(DoesUserExist)
  @Post('signup')
  async signup(@Body() user: UserDto) {
    console.log({ user });
    return await this.authService.create(user);
  }
}
