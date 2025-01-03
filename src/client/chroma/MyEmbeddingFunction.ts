import { getAzureEmbeddings } from "src/model/AzureOpenAIEmbeddings";

export class MyEmbeddingFunction {

    constructor() {
    }

    public async generate(texts: string[]): Promise<number[][]> {
        // do things to turn texts into embeddings with an api_key perhaps
        let embedding = await getAzureEmbeddings()
        let res = embedding.embedDocuments(texts)

        return res;
    }
}
