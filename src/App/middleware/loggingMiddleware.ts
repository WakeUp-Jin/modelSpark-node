import { KoaMiddlewareInterface, Middleware } from "routing-controllers";


@Middleware({ type: "before" })
export class LoggingMiddleware implements KoaMiddlewareInterface {
  async use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
    // 记录请求信息，例如请求的 URL


    // 调用下一个中间件
    await next();
  }
}