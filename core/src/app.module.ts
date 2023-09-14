import { Module } from '@nestjs/common'
import { DatabaseModule } from './infrastructure/database/database.module'
import { JwtModule } from '@nestjs/jwt'
import { MapperModule } from './infrastructure/automapper/mapper.module'
import { AuthModule } from '@modules/auth/auth.module'
import { UserModule } from '@modules/users/users.module'
import { getJwtSecret } from '@modules/auth/utils/getJwtSecret.util'
import { MulterModule } from '@nestjs/platform-express'
import { UniqueConstraint } from '@modules/globals/validators/unique.validator'
import { GenresModule } from '@modules/genres/genres.module'
import { BooksModule } from '@modules/books/books.module'
import { ConfigModule } from '@nestjs/config'
import multer from 'multer'

const secret = getJwtSecret()

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret,
    }),
    MapperModule,
    AuthModule,
    UserModule,
    GenresModule,
    BooksModule,
  ],
})
export class AppModule {}
