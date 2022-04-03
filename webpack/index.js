// 引入编译器类
import { Compiler } from "./Compiler.js";
// 初始化编译器并调用run函数
export function webpack(config) {
  const compiler = new Compiler(config);
  compiler.run();
}