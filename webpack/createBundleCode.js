const render = ({ modules }) => {
  let mapping = "";
  Object.keys(modules).forEach((id) => {
    let res = `${id}: [
    function (require, module, exports){
      ${modules[id].code}
    },${JSON.stringify(modules[id].mapping)}],`;
    mapping += res;
  });

  let resCode = `(function (modules) {
    function require(id) {
      const [fn, mapping] = modules[id];
      function localRequire(name) {
        return require(mapping[name]);
      }
      const module = { exports: {} };
      fn(localRequire, module, module.exports);
      return module.exports;
    }
    require(0);
  })({
    ${mapping}
  })`;

  return resCode;
};

export function createBundleCode(data) {
  const { modules } = data;
  let code = render({ modules });
  return code;
}
