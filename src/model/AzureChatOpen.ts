import { AzureChatOpenAI } from "@langchain/openai";
import dotenv from 'dotenv'

dotenv.config()

export const OPENAI_API_VERSION = process.env.OPENAI_API_VERSION

async function getAzureModel() {
    return new AzureChatOpenAI({
        azureOpenAIApiKey: process.env.OPENAI_API_KEY,
        azureOpenAIApiVersion: OPENAI_API_VERSION,
        azureOpenAIApiDeploymentName: process.env.DEPLOY_NAME,
        azureOpenAIApiInstanceName: process.env.INSTANCENAME,
    })
}

async function mainScript() {

    const azureModel = await getAzureModel()
    const result = await azureModel.invoke(``)
    console.log("🚀 ~ result:", result)
}

// mainScript()



export { getAzureModel }