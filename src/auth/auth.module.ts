import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategy/local.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {}
