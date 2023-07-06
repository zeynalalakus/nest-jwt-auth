import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { CreateUserDto } from "./create-user.dto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
  }


  async register(createUserDto: CreateUserDto) {
    const {email, password} = createUserDto;

    // checking user already exists or not
    const user = await this.userRepository.findOne({where: {email}});
    if (user) {
      throw new BadRequestException('User Already Exists')
    }

    // hashing the password with salt
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    // saving the user
    const newUser = this.userRepository.create({email, password: hashedPassword});
    await this.userRepository.save(newUser);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({where: {email}});
    if (user) {
      const [salt, hashedPassword] = user.password.split('.');

      const controlHashedPassword = (await scrypt(password, salt, 32)) as Buffer;
      if (hashedPassword === controlHashedPassword.toString('hex')) {
        return user;
      }
    }
    return null;
  }

}
