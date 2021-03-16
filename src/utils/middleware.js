import { _, store } from '.';
import { pathToRegexp, match, parse, compile } from 'path-to-regexp';
/* 
let _onSuccess = null; // 上传的成功函数 */

const createObjectURL = object => {
  return window.URL
    ? window.URL.createObjectURL(object)
    : window.webkitURL.createObjectURL(object);
};
const convertMap = async (ctx, next) => {
  await next();
  if (ctx.req.url.includes('/fieldmap')) {
    let data = ctx?.res?.data ?? {};
    data = _.mapValues(data, o => _.mapValues(o, d => d.enum));
    ctx.res = {
      ...ctx.res,
      data,
    };
  }
};
// 统一的接口响应拦截
const requestInterceptors = (url, { assets, ...options }) => {
  /**
   * 拦截器， 统一拦截请求，转换 restfull 风格API，
   * 统一加请求前缀
   **/
  const data = _.cloneDeep(assets);

  const match = parse(url);
  url = compile(url)(data);
  // 正则匹配完成，删除改对象
  for (let item of match) {
    if (item instanceof Object && item.name in data) {
      delete data[item.name];
    }
  }
  options.data = data;

  let locale = localStorage.getItem('umi_locale') || 'zh-CN'
  if (options.method === 'get') options.params = data;
  options.headers = Object.assign(options.headers, {
    accept: 'application/json',
    authorization: store.get('token'),
    locale: locale.replace('-', '_'),


  });
  // 处理上传文件
  if (options.method === 'post' && url.includes('uploadpic')) {
    let { data: extraData, file, onSuccess } = options.data;
    _onSuccess = onSuccess;
    let formData = new FormData();
    formData.append('file', file);
    for (let key in extraData) {
      formData.append(key, extraData[key]);
    }
    options.data = formData;
  }
  return { url, options };
};
// 拦截响应体
const responseInterceptors = response => {
  let disposition = response.headers.get('content-disposition');
  let downType = response.headers.get('content-type');
  let canDownLoad = disposition && disposition.split(';')[0] === 'attachment';
  if (canDownLoad) {
    response.blob().then(res => {
      let binaryData = [res];
      let url = createObjectURL(
        new Blob(binaryData, { type: downType.split(';')[0] }),
      ); //表示一个指定的file对象或Blob对象
      let a = document.createElement('a');
      document.body.appendChild(a);
      let fileName =
        disposition.split(';')[1].split('=')[1] || new Date().toLocaleString(); //filename名称截取
      a.href = url;
      a.download = fileName; //命名下载名称
      a.click(); //点击触发下载
      window.URL.revokeObjectURL(url); //下载完成进行释放
    });
    return { status: 0 };
  } 
  return response;
};

const adaptor = ({ status, data, msg: errorMessage }, { req }) => {
  /*   if (req.url === '/api/v1/uploadpic' && _onSuccess) {
      _onSuccess(data.ObjectURL);
    } */
  let showType = req.url.includes('/user/login') ? 0 : (status === 401 ? 9 : 1)
  return {
    data,
    errorCode: status,
    showType: showType,
    errorMessage,
    success: status === 0,
  };
};
const errorHandler = (error) => {
  console.dir(error)
  return error
}
export default {
  requestInterceptors,
  responseInterceptors,
  convertMap,
  adaptor,
  errorHandler
};
