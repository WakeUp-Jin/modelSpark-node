import { request } from "http";
import * as lark from "@larksuiteoapi/node-sdk";
import { uniqueFileName } from "../../utils/comon";
import { statSync, readFileSync, existsSync, mkdirSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

// export async function clientInit() {
//   return new lark.Client({
//     appId: 'cli_a68653db0e20d00b',

//     //测试的appid
//     // appId:'cli_a692200b1ff7d00c',
//     appSecret: 'Bx5ROz5bnmOlp4RzrVzILPOGzQGluJ6B',

//     //测试的appSecret
//     // appSecret:'lUeiTFSSLlucLx5zTKqF7mopUpcDMFbw'
//   })
// }

let clientInstance = null;
export const clientInit = () => {
  if (!clientInstance) {
    clientInstance = new lark.Client({
      // appId:CONSTANTS.FSAPPID,
      appId: process.env.feishuAPI,
      appSecret: process.env.feishuSecret,

      //正式的密钥
      // Bx5ROz5bnmOlp4RzrVzILPOGzQGluJ6B
      // appSecret: 'Bx5ROz5bnmOlp4RzrVzILPOGzQGluJ6B',
      //测试版本的密钥
      // appSecret:CONSTANTS.FSSECRET,

      //测试的appSecret
      // appSecret:'lUeiTFSSLlucLx5zTKqF7mopUpcDMFbw'
    });
  }

  return clientInstance;
};

//获取飞书多维表格的数据
export async function getFeishuDocument(
  app_token,
  table_id,
  view_id = "vewPnh5ETp"
) {
  const client = await clientInit();
  const result = await client.bitable.appTableRecord.search({
    path: {
      app_token: app_token,
      table_id: table_id,
    },
    data: {
      view_id: view_id,
    },
  });

  let hasMore = result.data.has_more;
  let pageToken = result.data.page_token;
  let data = [...result.data.items];

  while (hasMore) {
    const result = await client.bitable.appTableRecord.search({
      path: {
        app_token: app_token,
        table_id: table_id,
      },
      data: {
        view_id: view_id,
      },
      params: {
        page_token: pageToken,
        page_size: 500,
      },
    });

    pageToken = result.data.page_token;
    data.push(...result.data.items);

    if (!result.data.has_more) {
      break;
    }
  }

  // console.dir(courseFeishuData,{depth:null})

  // console.dir(data.pop(),{depth:null})
  return data;
}

/**
 * 飞书根据条件查询数据-单个搜索，小于20条
 * @param app_token
 * @param table_id
 * @param view_id
 * @param filter
 * @returns
 */
export async function searchFeishuDocument(
  app_token,
  table_id,
  view_id = "vewPnh5ETp",
  filter
) {
  try {
    const client = await clientInit();

    const result = await client.bitable.appTableRecord.search({
      path: {
        app_token,
        table_id,
      },
      params: {
        page_size: 20,
      },
      data: {
        view_id,
        filter,
      },
    });

    // console.log("飞书查询接口根据条件查询成功==>", result);

    return result.data.items;
  } catch (error) {
    console.log("飞书查询接口根据条件查询失败", error);

    return [];
  }
}

//获取飞书多维表格的数据
export async function searchAllFeishuDocument(
  app_token,
  table_id,
  view_id,
  filter
) {
  const client = await clientInit();
  const result = await client.bitable.appTableRecord.search({
    path: {
      app_token: app_token,
      table_id: table_id,
    },
    data: {
      view_id: view_id,
      filter,
    },
  });

  let hasMore = result.data.has_more;
  let pageToken = result.data.page_token;
  let data = [...result.data.items];

  while (hasMore) {
    const result = await client.bitable.appTableRecord.search({
      path: {
        app_token: app_token,
        table_id: table_id,
      },
      data: {
        view_id: view_id,
        filter,
      },
      params: {
        page_token: pageToken,
        page_size: 500,
      },
    });

    pageToken = result.data.page_token;
    data.push(...result.data.items);

    if (!result.data.has_more) {
      break;
    }
  }
  // console.dir(courseFeishuData,{depth:null})

  // console.dir(data.pop(),{depth:null})
  return data;
}

// 下载文件
export async function download(file_token, fileSuffix) {
  const client = await clientInit();
  const res = await client.drive.file.download({
    path: { file_token: file_token },
  });

  // console.log(res)

  // 生成临时文件
  const fileTmpName = `/tmp/${uniqueFileName()}.${fileSuffix}`;
  const downloadRes = await res.writeFile(fileTmpName);
  // console.log(downloadRes)
  //   const fileName = resls[0].name

  return fileTmpName;

  // console.dir(courseFeishuData,{depth:null})
}

export async function downloadMany(file_token, fileSuffix, filename, dirName) {
  const client = await clientInit();
  const res = await client.drive.file.download({
    path: { file_token: file_token },
  });

  // console.log(res)

  // 生成临时文件
  let dirTempName = `/Users/xjk/Desktop/voiceEffect/${dirName}`;
  if (!existsSync(dirTempName)) {
    mkdirSync(dirTempName, { recursive: true });
    console.log(`🚀 ~ downloadMany ~ 文件夹创建成功`, dirTempName);
  }

  const fileTmpName = `${dirTempName}/${filename}${fileSuffix}`;
  const downloadRes = await res.writeFile(fileTmpName);
  // console.log(downloadRes)
  //   const fileName = resls[0].name

  return fileTmpName;

  // console.dir(courseFeishuData,{depth:null})
}

// 更新飞书表格字段
export async function updateFeishuDocument(
  app_token,
  table_id,
  record_id,
  data: any
) {
  const client = await clientInit();
  return await client.bitable.appTableRecord.update({
    data: data,
    path: {
      app_token: app_token,
      table_id: table_id,
      record_id: record_id,
    },
  });
}

/**
 *
 * @param fileBase --文件二进制的内容
 * @param file_name  -- 文件名字
 * @param parent_node  -- 云空间的节点
 * @returns
 */
//分片上传文件-
export async function uploadBatchFile(fileBase, file_name, parent_node) {
  console.log("🚀 ~ uploadBatchFile ~ fileBase:", fileBase);
  const client = await clientInit();

  let size = statSync(fileBase);
  console.log("🚀 ~ feishuUpdateFile ~ size:", size);

  const result = await client.drive.file.uploadPrepare({
    data: {
      file_name: file_name,
      parent_type: "explorer",
      parent_node: parent_node,
      size: size.size,
    },
  });
  console.log("🚀 ~ uploadBatchFile ~ result:", result);

  const file = await readFileSync(fileBase);
  console.log("🚀 ~ uploadBatchFile ~ file:", file);

  const CHUNK_SIZE = result.data.block_size; // 4MB
  const totalChunks = result.data.block_num;

  // const totalChunks = Math.ceil(size.size / result.data.block_size);

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    console.log("🚀 ~ 开始了:", chunkIndex);
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, size.size);
    // const end=start+CHUNK_SIZE
    const chunk = file.slice(start, end); // 读取文件分片

    // 2. 上传分片
    // await uploadChunk(uploadId, chunk, chunkIndex);

    console.log("🚀 ~ uploadBatchFile ~ ===========>33:", {
      upload_id: result.data.upload_id,
      seq: chunkIndex,
      size: end - start,
      file: chunk,
    });
    const result2 = await client.drive.file.uploadPart({
      data: {
        upload_id: result.data.upload_id,
        seq: chunkIndex,
        size: end - start,
        file: chunk,
      },
    });

    console.log("🚀 ~ uploadBatchFile---111 ~ result2:", result2);
  }

  const result3 = await client.drive.file.uploadFinish({
    data: {
      upload_id: result.data.upload_id,
      block_num: result.data.block_num,
    },
  });

  console.log("🚀 ~ uploadBatchFile ~ result3:", result3);

  return result3.data.file_token;
}

/**
 * 根据记录字段获取多维表格的数据
 * @param app_token
 * @param table_id
 * @param record_ids
 */
export async function getDataByRecord(app_token, table_id, record_id) {
  const clinet = await clientInit();

  const result = await clinet.bitable.appTableRecord.get({
    path: {
      app_token,
      table_id,
      record_id,
    },
  });

  // console.dir(result.data.record.fields,{depth:null})

  return result.data.record.fields;
}

/**
 * 获取飞书多维表格中的最后一条数据
 * @param app_token
 * @param table_id
 * @param view_id
 *
 * 注意事项：
 * - 多维表格中必须要存在一个“创建时间”的字段，用来进行排序筛选
 */
export async function getLastRecordByDocument(app_token, table_id, view_id) {
  const client = await clientInit();
  const result = await client.bitable.appTableRecord.search({
    path: {
      app_token: app_token,
      table_id: table_id,
    },
    data: {
      view_id: view_id,
      sort: [
        {
          field_name: "创建时间",
          desc: true,
        },
      ],
    },
    params: {
      page_size: 1,
    },
  });

  return result.data.items[0];
}

/**
 * 多维表格中增加多条数据
 * @param app_token
 * @param table_id
 * @param records
 */
export async function createRecordMany(app_token, table_id, records) {
  const client = await clientInit();

  const result = await client.bitable.appTableRecord.batchCreate({
    path: {
      app_token,
      table_id,
    },
    data: {
      records,
    },
  });

  return result;
}

/**
 * 多维表格新增加一条记录
 * @param app_token
 * @param table_id
 * @param records
 * @returns
 */
export async function createRecordOne(app_token, table_id, fields) {
  const client = await clientInit();

  const result = await client.bitable.appTableRecord.create({
    path: {
      app_token,
      table_id,
    },
    data: {
      fields,
    },
  });
  console.log("🚀 ~ createRecordOne ~ result:", result);

  return result.data;
}

/**
 * 同时修改多条数据
 * @param app_token
 * @param table_id
 * @param record_id
 */
export async function updateRecordMany(app_token, table_id, recordList) {
  const client = await clientInit();

  const result = await client.bitable.appTableRecord.batchUpdate({
    path: {
      app_token,
      table_id,
    },
    data: {
      records: recordList,
    },
  });

  return result;
}

/**
 * 创建一张多维表格
 * @param app_token
 * @param data
 * @returns
 */
export async function createTable(app_token, data) {
  const client = await clientInit();

  const result = await client.bitable.appTable.create({
    path: {
      app_token,
    },
    data,
  });

  return result;
}

/**
 * 获取飞书云文档的文件列表
 * @param folderToken
 * @returns
 *
 */

export async function getFileList(folderToken) {
  const client = await clientInit();
  const list = [];

  for await (const item of await client.drive.file.listWithIterator({
    params: {
      folder_token: folderToken,
      order_by: "EditedTime",
      direction: "DESC",
    },
  })) {
    // console.log(item);
    // list  追加
    list.push(...item.files);
  }
  return list;
}

// // 还可以使用迭代器的方式便捷的获取数据，无需手动维护page_token
// (async () => {
// 	for await (const item of await client.bitable.appTableField.listWithIterator({
// 			params: {
// 				page_size: 20,
// 			},
// 		},
// 		lark.withTenantToken("")
// 	)) {
// 		console.log(item);
// 	}

/*
  * 获取多维表格的字段列表
  * @param app_token
  * @param table_id

*/
export async function getTableFieldList(app_token, table_id) {
  const client = await clientInit();
  const list = [];
  for await (const item of await client.bitable.appTableField.listWithIterator({
    path: {
      app_token: app_token,
      table_id: table_id,
    },
    params: {
      page_size: 20,
    },
  })) {
    list.push(...item.items);
  }

  return list;
}

// 创建多维表格字段
/**
 * 创建多维表格字段
 * @param app_token
 * @param table_id
 * @param data
 * @returns
 */

export async function addTableField(app_token, table_id, data) {
  const client = await clientInit();
  return await client.bitable.appTableField.create({
    path: {
      app_token: app_token,
      table_id: table_id,
    },
    data,
  });
}
