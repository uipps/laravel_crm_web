import { request } from 'umi';
import api from './api';

function gent(params, arg) {
  let [url, method] = [params, 'GET'];
  const paramsArray = params.split(' ');
  if (paramsArray.length === 2) {
    url = paramsArray[1];
    method = paramsArray[0];
  }
   
  return function(data, option = {}) {
    return request(url, {
      method: method.toLocaleLowerCase(),
      assets: data,
      // requestType: 'application/json',
      ...option,
    });
  };
}
function runApi(api) {
  return Object.keys(api).reduce((obj, key) => {
    return {
      ...obj,
      [key]:
        Object.prototype.toString.call(api[key]) === '[object Object]'
          ? runApi(api[key])
          : gent(api[key]),
    };
  }, {});
}
let services = runApi(api);

export default services;
