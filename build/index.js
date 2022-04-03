import path, { dirname } from "path";
import { webpack } from "../webpack/index.js";
import { fileURLToPath } from "url";

// ES语法中没有预设的__dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

// 打包配置
const webpackConfig = {
  entry: path.join(__dirname, "../src/index.js"),
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "bundle.js",
  },
};
// 执行打包
webpack(webpackConfig);
