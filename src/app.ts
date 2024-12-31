import 'reflect-metadata'
import Koa from 'koa'
import { useKoaServer } from 'routing-controllers'
import { routingConfig } from './App/routing-controllers'
import { CONSTANS } from './App/constans'
import { logger } from './utils/comon'
import koaLogger from 'koa-pino-logger'
import { customCatchErr } from './App/middleware/customCatchErr'

const app: Koa = new Koa()


useKoaServer(app, routingConfig)

//处理日志的中间件
app.use(koaLogger({ logger: logger }))

//处理异常的中间件
app.use(customCatchErr)


app.listen(CONSTANS.port, () => {
    logger.info(`server start,port:${CONSTANS.port}`)
})




