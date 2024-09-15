import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const newPassword = await this.hashPassword(registerUserDto.password);
    return await this.userRepository.save({
      ...registerUserDto,
      password: newPassword,
      refresh_token: 'example',
    });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const newPassword = await bcrypt.hash(password, salt);
    return newPassword;
  }
}
