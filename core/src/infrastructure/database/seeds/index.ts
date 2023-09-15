import { UserRegisterDto } from '@modules/auth/dto/userRegister.dto'
import { GenreCreateDto } from '@modules/genres/dto/genreCreate.dto'
import { Prisma, PrismaClient } from '@prisma/client'
import { hash, hashSync } from 'bcrypt'

const prisma = new PrismaClient()

const user: UserRegisterDto = {
  birthDate: new Date(),
  email: 'user@gmail.com',
  name: 'user',
  password: hashSync('123', 9),
  role: 'user',
}

const book: Prisma.BookCreateInput = {
  name: 'Копи царя Соломона',
  publishedDate: new Date(),
  redaction: 'Piter',
}

const genres: GenreCreateDto[] = [
  { name: 'Роман' },
  { name: 'Приключение' },
  { name: 'Комедия' },
]

const books: Prisma.BookCreateInput[] = [
  book,
  { ...book, name: 'Туарег' },
  { ...book, name: 'Шантарам' },
]

const users: UserRegisterDto[] = [
  user,
  { ...user, email: 'admin@gmail.com', role: 'admin' },
  { ...user, email: 'user2@gmail.com' },
]

const bookResource = {
  fileName: 'book.zip',
  filePath: 'booksFiles/book.zip',
  mimeType: 'application/zip',
  size: 259000,
}

async function seed() {
  await prisma.user.createMany({
    data: users,
  })

  await prisma.genre.createMany({
    data: genres,
  })

  const authorsIds = await prisma.user
    .findMany({
      take: 3,
      select: {
        id: true,
      },
    })
    .then((res) => res.map((el) => el.id))

  const genresIds = await prisma.genre
    .findMany({
      take: 3,
      select: {
        id: true,
      },
    })
    .then((res) => res.map((el) => el.id))

  const booksCreateMap: Prisma.BookCreateInput[] = books.map((el) => {
    return {
      ...el,
      authors: {
        createMany: { data: authorsIds.map((userId) => ({ userId })) },
      },
      genres: {
        createMany: {
          data: genresIds.map((genreId) => ({ genreId })),
        },
      },
    }
  })

  await Promise.all(booksCreateMap.map((data) => prisma.book.create({ data })))

  const booksIds = await prisma.book
    .findMany({
      take: 3,
      select: {
        id: true,
      },
    })
    .then((res) => res.map((el) => el.id))

  const booksResources = booksIds.map((bookId) => ({ ...bookResource, bookId }))

  await prisma.bookResource.createMany({
    data: booksResources,
  })
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
