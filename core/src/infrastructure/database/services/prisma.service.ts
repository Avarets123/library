import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }

  async getTableFields(tableName: string) {
    const tableFields: {
      column_name: string
      data_type: string
    }[] = await this.$queryRaw(Prisma.sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = ${tableName}
      `)

    return tableFields
  }

  async getTableFieldsByType(tableName: string, type: string) {
    const tableFields = await this.getTableFields(tableName)

    return tableFields
      .filter((f) => f.data_type === type)
      .map((f) => f.column_name)
  }
}
