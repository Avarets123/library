import { UserRegisterDto } from '@modules/auth/dto/userRegister.dto'

const birthDate = new Date()
export const userRegValidData: UserRegisterDto = {
  email: 'test@gmail.com',
  birthDate,
  name: 'tester',
  password: '123',
  role: 'user',
}

export const userRegInValidData = {
  email: 'test@gmail.com',
  birthDate: new Date(),
  name: 'tester',
}
