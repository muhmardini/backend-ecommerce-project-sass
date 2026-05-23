import {defineConfig} from 'prisma/config'
import 'dotenv/config'
import { env } from '#shared/env'

export default defineConfig({
    schema: "./prisma/schema.prisma",
    datasource: {
        url: env.DATABASE_URL
    }
})