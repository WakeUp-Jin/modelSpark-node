import { ChromaClient } from 'chromadb'
import dotenv from 'dotenv'
import { getAzureEmbeddings } from 'src/model/AzureOpenAIEmbeddings'


dotenv.config()

console.log('process.env.CHROMAURL', process.env.CHROMAURL)




let client = new ChromaClient({ path: process.env.CHROMAURL })
// console.log("🚀 ~ client:", client)

const collection = await client.createCollection({
    name: "my_collection_test1",
    // embeddingFunction: new MyEmbeddingFunction(),
});

// await collection.add({
//     documents: [
//         "This is a document about pineapple",
//         "This is a document about oranges",
//     ],
//     ids: ["id1", "id2"],
// });