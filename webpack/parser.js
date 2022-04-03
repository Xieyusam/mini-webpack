// 用于解析我们的源内容生成AST树
import { parse as parseBabel } from "@babel/parser";
// traverse是babel提供的遍历和更新节点的工具
import rawTraverse from "@babel/traverse";
// transformFromAst是babel-core中用于把Ast转换成es5-js的
import { transformFromAst } from "babel-core";
// es
const traverse = rawTraverse.default;

export function parse(source) {
  // 保存文件内import引用的依赖路径
  const dependencies = [];
  // 将传入的sourceCode源内容js转换成ast树
  // 这里采用的是es module
  const ast = parseBabel(source, {
    sourceType: "module",
  });
  // 遍历整个ast树，获取import的路径
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      // 基于 import 来获取当前文件需要的依赖
      dependencies.push(node.source.value);
    },
  });
  // 把里面的 import 替换成 require
  const { code } = transformFromAst(ast, null, {
    // 需要使用 babel-preset-env
    presets: ["env"],
  });
  //  返回转换后的代码与模块依赖关系
  return {
    code,
    dependencies,
  };
}
