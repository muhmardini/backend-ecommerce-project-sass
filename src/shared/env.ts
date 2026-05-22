import "dotenv/config"

const requireEnv = (name: string): string => {
    const value = process.env[name]
    if(!value){
        throw new Error(`Missing Required environment Variable: ${name} \n Make sure it is set in your .env file ore environment.`)
    }
    return value
}

export const env = {
    //  Server
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "3000", 10),

    //  Data Base
    DATABASE_URL: requireEnv('DATABASE_URL'),
    DIRECT_URL: requireEnv('DIRECT_URL'),

    //  JWT
    JWT_SECRET: requireEnv('JWT_SECRET'),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
    JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
} as const