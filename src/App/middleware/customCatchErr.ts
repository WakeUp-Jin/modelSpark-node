import { Context, Next } from "koa";

//异常处理函数
export const customCatchErr=async (ctx:Context,next:Next)=>{
    try {
        
        await next()
    } catch (err) {
        // 捕获异常并处理
        console.error('Caught an error:', err);
        ctx.status = err.status || 500; // 设置 HTTP 状态码
        ctx.body = { message: 'An error occurred', error: err.message }; // 返回错误信息
    }
}