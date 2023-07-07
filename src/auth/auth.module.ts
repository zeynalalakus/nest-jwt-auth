import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { secretKey } from "./constants/jwt-constants";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: secretKey,
      signOptions: {expiresIn: '1h'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
