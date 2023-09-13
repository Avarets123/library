import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { exceptionBoot } from './infrastructure/exceptions/exception.boot'
import { validationBoot } from './infrastructure/validation/validation.boot'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const PORT = +process.env.PORT || 3002

  app.enableCors()
  exceptionBoot(app)
  validationBoot(app)
  exceptionBoot(app)

  await app.listen(
    PORT,
    () => `Library service has ben started on port: ${PORT}`,
  )
}
bootstrap()
