import dotenv from 'dotenv'
import { DeepSeekChatAPI } from '../client/deepSeek'
import { LLM, type BaseLLMParams } from "@langchain/core/language_models/llms";
import type { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { GenerationChunk } from "@langchain/core/outputs";
import axios from "axios";

dotenv.config()

//自定义deepSeek模型
interface DeepSeekLLMInput extends BaseLLMParams {
  deepModel: string;
  deepStream?: boolean;
  response_format?: ResponseFormat

}

interface ResponseFormat {
  type: string
}

class DeepSeekLLM extends LLM {
  deepModel: string;
  deepStream?: boolean;
  response_format?: ResponseFormat;

  constructor(fields: DeepSeekLLMInput) {
    super(fields);
    this.deepStream = fields.deepStream
    this.deepModel = fields.deepModel
    this.response_format = fields.response_format

  }

  _llmType() {
    return "custom";
  }

  async _call(
    prompt: string,
    options: this["ParsedCallOptions"],
    runManager: CallbackManagerForLLMRun
  ): Promise<string> {
    // Pass `runManager?.getChild()` when invoking internal runnables to enable tracing
    // await subRunnable.invoke(params, runManager?.getChild());
    // console.log(prompt)
    console.log('--')
    let result: any = await DeepSeekChatAPI({
      model: this.deepModel,
      stream: this.deepStream,
      response_format: this.response_format,
      messages: [
        { "role": "system", "content": "You are a helpful assistant." },
        { "role": "user", "content": prompt }
      ]
    })

    return result.data.choices[0].message.content;
  }

  async *_streamResponseChunks(
    prompt: string,
    options: this["ParsedCallOptions"],
    runManager?: CallbackManagerForLLMRun
  ): AsyncGenerator<GenerationChunk> {
    // Pass `runManager?.getChild()` when invoking internal runnables to enable tracing
    // await subRunnable.invoke(params, runManager?.getChild());
    for (const letter of prompt.slice(0)) {
      yield new GenerationChunk({
        text: letter,
      });
      // Trigger the appropriate callback
      await runManager?.handleLLMNewToken(letter);
    }
  }
}

export async function getDeepSeekModel({ deepStream = false, response_format = { type: 'text' } } = {}) {


  return new DeepSeekLLM({ deepModel: 'deepseek-chat', deepStream, response_format });

}

async function mainScript() {
  // let res=await doubaoAPI('你好')
  // console.log("🚀 ~ res:", res)
  let apiKey: any = process.env.duobaoAPI
  let modelKey: any = process.env.doubaoModel1

  const llm = await getDeepSeekModel()

  console.log(await llm.invoke('你好'))

  // const llm = new DoubaoLLM({ apiKey,modelKey });

  // console.log(await llm.invoke('你好'))
}

// mainScript()





