import { AzureOpenAIEmbeddings } from "@langchain/openai";
import dotenv from 'dotenv'
import { OPENAI_API_VERSION } from "./AzureChatOpen";

dotenv.config()


async function getAzureEmbeddings() {
    return new AzureOpenAIEmbeddings({
        azureOpenAIApiKey: process.env.OPENAI_API_KEY,
        azureOpenAIApiInstanceName: process.env.INSTANCENAME,
        azureOpenAIApiDeploymentName: process.env.EMBED_DEPLOY_NAME,
        azureOpenAIApiVersion: OPENAI_API_VERSION
    })
}





export { getAzureEmbeddings }

async function mainScript() {

    let model = await getAzureEmbeddings()
    let res = await model.embedQuery('Hello World')

    console.log(res)

}


// mainScript()