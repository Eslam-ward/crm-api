
import { JwtService } from '@nestjs/jwt';

export function generateToken(userId: string, jwtService: JwtService) {
  return jwtService.sign({ userId });
}
