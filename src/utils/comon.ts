import ProgressBar from 'progress'
import { v4 as uuidv4 } from 'uuid'
import pino from 'pino'

/**
 * 进度条的工具的生成函数
 * @param length 
 * @returns 
 */
export const getProgress = (length: number) => {
    var bar = new ProgressBar('downloading [:bar] :rate/bps :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: length
    });

    return bar
}

// 文件名加密
export function uniqueFileName(): string {
    // 生成一个唯一的文件名
    // 生成 UUID
    const uuid = uuidv4()

    // 移除所有的 '-'
    const uniqueFilename = uuid.replace(/-/g, '')
    return uniqueFilename
}


export const logger = pino({
    transport: {
        target: 'pino-pretty', // 美化输出
        options: {
            colorize: true, // 彩色日志
            translateTime: 'SYS:standard', // 添加时间格式化

        },
    },
})