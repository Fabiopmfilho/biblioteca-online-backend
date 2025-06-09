/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const adminEmail = this.config.get('ADMIN_EMAIL');
    const adminPassword = this.config.get('ADMIN_PASSWORD');

    if (email === adminEmail && password === adminPassword) {
      const payload = { email, sub: 1 };
      const token = this.jwtService.sign(payload);
      return { access_token: token };
    }

    throw new UnauthorizedException('Credenciais inválidas');
  }

  login(user: { email: string }) {
    const payload = { sub: user.email };
    return {
      access_token: this.jwt.sign(payload),
    };
  }
}
