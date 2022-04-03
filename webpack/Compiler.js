import path from "path";
import fs from "fs";
import Compilation from "./Compilation.js";
import { createBundleCode } from "./createBundleCode.js";

export class Compiler {
  constructor(config) {
    const { entry, output } = config;
    // 保存入口
    this._entry = entry;
    // 保存输出设置
    this._output = output;
    // 保存的Compilation实例
    this._compilation = null;
  }
  //启动编译器
  run() {
    // 创建Compilation实例
    //Compilation构造函数中传入entry入口
    this._compilation = new Compilation({
      entry: this._entry,
    });
    //执行make构建依赖关系图
    this._compilation.make();
    // 输出bundle
    this.emitFiles();
  }
  // 输出
  emitFiles() {
    // 遍历依赖关系图
    // 将其转换为id为key的modules对象
    const modules = {}
    this._compilation.graph.forEach((m) => {
      modules[m.id] = {
          code: m.code,
          mapping: m.mapping,
        };
      });
    // 最后基于 output 生成 bundle 文件即可
    const outputPath = path.join(this._output.path, this._output.filename);

    // 创建对应的目录
    if (!fs.existsSync(this._output.path)) {
      fs.mkdirSync(this._output.path);
    }
    // 写入bundle中
    fs.writeFileSync(outputPath, createBundleCode({ modules }));
  }
}
