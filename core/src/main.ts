import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { exceptionBoot } from './infrastructure/exceptions/exception.boot'
import { validationBoot } from './infrastructure/validation/validation.boot'
import { LoggerErrorInterceptor } from 'nestjs-pino'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false })

  const PORT = +process.env.PORT || 3010

  app.enableCors()
  app.useGlobalInterceptors(new LoggerErrorInterceptor())
  validationBoot(app)
  exceptionBoot(app)

  await app.listen(PORT)
  console.log(`Library service has ben started on port: ${PORT}`)

  console.log(new Date())
}
bootstrap()
