import dotenv from 'dotenv'
import axios from 'axios'
import { DeepSeekBaseURL } from '../../constant/modelConstant'

dotenv.config()
let data1 = {
    "model": "deepseek-chat",
    "messages": [
        { "role": "system", "content": "You are a helpful assistant." },
        { "role": "user", "content": "Hello!" }
    ],
    "stream": false
}


//聊天API
export async function DeepSeekChatAPI(data: any) {
    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.deepseekAPI}`
    }

    // console.log(data)
    let result = await axios.post(
        `${DeepSeekBaseURL}/chat/completions`,
        JSON.stringify(data),
        { headers }
    )
    return result

    // console.log("🚀 ~ DeepSeekChatAPI ~ result:", result.data)


}

// DeepSeekChatAPI(data1)