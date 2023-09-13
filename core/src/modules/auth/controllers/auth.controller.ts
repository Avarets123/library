import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { UserRegisterDto } from '../dto/userRegister.dto'
import { UserLoginDto } from '../dto/userLogin.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  userRegister(@Body() body: UserRegisterDto) {
    return this.authService.register(body)
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('login')
  userLogin(@Body() body: UserLoginDto) {
    return this.authService.login(body)
  }
}
