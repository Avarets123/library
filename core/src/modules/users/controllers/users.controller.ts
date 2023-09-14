import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common'
import { UsersService } from '../services/users.service'
import { ListingDto } from '@infrastructure/common/pagination/dto/listing.dto'
import { JwtAuthGuard } from '@modules/auth/guards/jwtAuth.guard'
import { AuthUser } from '@modules/auth/decorators/authUser.decorator'
import { User } from '@prisma/client'
import { UserUpdateDto } from '../dto/userUpdate.dto'

@Controller('authors')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  findMany(@Query() listing: ListingDto) {
    return this.userService.findMany(listing)
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':authorId')
  @UseGuards(JwtAuthGuard)
  patchUser(
    @Param('authorId', ParseUUIDPipe) authorId: string,
    @AuthUser() authUser: User,
    @Body() dto: UserUpdateDto,
  ) {
    return this.userService.updateUser(authorId, dto, authUser)
  }
}
