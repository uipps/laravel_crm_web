import store2 from 'store2';
export moment from 'moment';
export { default as _ } from 'lodash';
export { pathToRegexp } from 'path-to-regexp';
export { compile as pathCompile } from 'path-to-regexp';
export { match as pathMatch } from 'path-to-regexp';
export { default as qs } from 'qs'
export { default as memoizeOne } from 'memoize-one';
export { default as layout } from './layout';
export { default as md5 } from 'md5';
export { default as numeral } from 'numeral';
export { default as middleware } from './middleware';
export { default as basic } from './basic';
export { default as Explain } from './explain'

export { default as pluto } from './pluto'

export const store = store2.namespace('crm'); // 创建缓存的命名空间

