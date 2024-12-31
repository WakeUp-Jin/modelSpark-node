import { clientInit } from "./index";
import { uniqueFileName } from "../../utils/comon";
import { statSync, readFileSync, createReadStream } from "fs";
import * as fs from "fs";
import * as crypto from "crypto";

/**
 *
 * @param fileBase --文件二进制的内容
 * @param file_name  -- 文件名字
 * @param parent_node  -- 云空间的节点
 * @returns
 */
//分片上传文件-
export async function uploadBatchFile(fileBase, file_name, parent_node) {
  const client = await clientInit();

  // 获取文件大小
  let fileStats = statSync(fileBase);

  // 上传准备
  const result = await client.drive.file.uploadPrepare({
    data: {
      file_name: file_name,
      parent_type: "explorer",
      parent_node: parent_node,
      size: fileStats.size,
    },
  });

  // 分块信息
  const CHUNK_SIZE = result.data.block_size; // 每个块的大小，单位为字节
  const totalChunks = result.data.block_num;

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, fileStats.size);
    // 创建文件流，并指定读取范围
    const chunkStream = createReadStream(fileBase, { start, end: end - 1 });

    // 上传分片
    try {
      const result2 = await client.drive.file.uploadPart({
        data: {
          upload_id: result.data.upload_id,
          seq: chunkIndex,
          size: end - start,
          file: chunkStream,
        },
      });
    } catch (uploadError) {
      console.error(`❌ Error uploading chunk ${chunkIndex + 1}`, uploadError);
      throw uploadError; // 如果上传某个分片失败，抛出错误
    }
  }

  // 上传完成
  try {
    const result3 = await client.drive.file.uploadFinish({
      data: {
        upload_id: result.data.upload_id,
        block_num: result.data.block_num,
      },
    });

    return result3.data.file_token;
  } catch (finishError) {
    console.error("❌ Error finishing the upload:", finishError);
    throw finishError;
  }
}

/**
 * 根据文件夹获取文件列表
 * @param folder_token
 * @returns
 */
export async function getDirveFileList(folder_token) {
  const client = await clientInit();

  try {
    let result = await client.drive.file.list({
      params: {
        folder_token,
        page_size: 200,
      },
    });
    if (result.code !== 0) {
      console.log("获取文件列表失败", result);
      return null;
    }

    return result.data;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 新创建文件夹
 * @param name
 * @param folder_token
 * @returns
 */
export async function createFolder(name: string, folder_token: string) {
  const client = await clientInit();
  try {
    let result = await client.drive.file.createFolder({
      data: {
        name,
        folder_token,
      },
    });

    if (result.code !== 0) {
      console.log("创建文件夹失败", result);
      return null;
    }

    console.log(`${name}文件夹创建成功`, result);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getFileMetaByFeishu(doc_token: string, doc_type: string) {
  let client = await clientInit();
  try {
    let result = await client.drive.meta.batchQuery({
      data: {
        request_docs: [
          {
            doc_token,
            doc_type,
          },
        ],
        with_url: true,
      },
    });

    if (result.code !== 0) {
      console.log("获取文件元数据失败", result);
      return null;
    }

    return result.data;
  } catch (error) {
    console.log(error);
  }
}

// 计算文件的 MD5 值
export async function getFileMd5(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("md5");
    const stream = fs.createReadStream(filePath);

    stream.on("data", (data) => {
      hash.update(data);
    });

    stream.on("end", () => {
      resolve(hash.digest("hex"));
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
}
