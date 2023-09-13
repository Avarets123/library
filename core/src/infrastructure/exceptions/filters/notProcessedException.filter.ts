import { HttpException } from '@nestjs/common'

interface ErrorResponse {
  code: string
  message: string
  status: number
}

export class NotProcessedException extends HttpException {
  constructor(response: ErrorResponse, status: number) {
    super(response, status)
  }

  toString() {
    const { message, status } = this.message as unknown as ErrorResponse
    const name = this.constructor.name
    return { message, status, name }
  }
}
