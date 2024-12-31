import dotenv from 'dotenv'
import { localhost } from './localhost'
import { logger } from '../../utils/comon'
dotenv.config()

export const getConstansByEnv = () => {
    logger.info(`env环境注入,${process.env.NODE_ENV}`)
    const env = process.env.NODE_ENV

    switch (env) {
        case "localhost":
            return localhost
        case "development":
            break;
        case "production":
            break;
        default:
            throw new Error('Invalid environment. Please set ENV to localhost, staging, or production.');
    }
}

export const CONSTANS = getConstansByEnv()
console.log("环境常量：", CONSTANS)
