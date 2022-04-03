import path from "path";
import fs from "fs";
import { parse } from "./parser.js";
let ID = 0;
export default class Compilation {
  constructor({ entry }) {
    // 存放入口
    this._entry = entry;
    // 存放module
    this.graph = [];
  }
  // 启动
  make() {
    // 构建模块
    function _buildModule(filename) {
      // 1. 获取模块的代码
      let sourceCode = fs.readFileSync(filename, { encoding: "utf-8" });

      // 2. 获取模块的依赖关系和把 import 替换成 require
      const { code, dependencies } = parse(sourceCode);
      return {
        code,
        dependencies,
        filename,
        mapping: {},
        id: ID++,
      };
    }

    // 处理入口Module
    const entryModule = _buildModule(this._entry);
    // 放入模块关系图
    this.graph.push(entryModule);
    // 通过队列的方式来遍历_buildModule所有的文件都
    const moduleQueue = [];
    // 放入入口entryModule
    moduleQueue.push(entryModule);
    while (moduleQueue.length > 0) {
      const currentModule = moduleQueue.shift();
      currentModule.dependencies.forEach((dependence) => {
        // 提前处理下 dependence 的路径
        // 需要完整的文件路径
        const childPath = path.resolve(
          path.dirname(currentModule.filename),
          dependence
        );
        const childModule = _buildModule(childPath);
        // mapping 的  key  需要是相对路径
        currentModule.mapping[dependence] = childModule.id;
        // 放入队列
        moduleQueue.push(childModule);
        this.graph.push(childModule);
      });
    }
  }
}
