import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
const prismaClientSingleton = () => 
{
  const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" })
  return new PrismaClient({ adapter })
}
declare global 
{
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
export default prisma
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

