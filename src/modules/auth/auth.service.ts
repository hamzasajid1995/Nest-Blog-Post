import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOneByEmail(username);
    if (!user) {
      return null;
    }

    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }

    const { password, ...result } = user['dataValues'];

    return result;
  }

  public async signin(user) {
    const token = await this.generateToken(user);
    return { user, token };
  }

  public async create(user) {
    console.log({ user });
    const pass = await this.hashPassword(user.password);
    console.log({ pass });
    const newUser = await this.userService.create({ ...user, password: pass });
    console.log({ newUser });

    const { password, ...result } = newUser['dataValues'];

    const token = await this.generateToken(result);
    console.log({ token });

    return { user: result, token };
  }

  async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async comparePassword(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}
