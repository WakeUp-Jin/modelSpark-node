export const customCors={
    origin: (context:any)=>context.request.header.origin || context.request.origin,  // 根据请求源自动设置
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'], // 允许的请求方法
    allowHeaders: ['content-type'],  // 允许的请求头
    credentials: true,  // 是否允许发送凭证
}