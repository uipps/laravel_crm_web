import { store, _, memoizeOne } from '.';
import { tail } from 'lodash';
function traverseTree(node, option = { title: 'title', value: 'value' }) {
  return node.reduce((prev, next) => {
    return [
      ...prev,
      {
        title: next[option.title],
        value: String(next[option.value]),
        children:
          next.children && next.children.length
            ? traverseTree(next.children, option)
            : [],
      },
    ];
  }, []);
}
function formatDDIC(alignment, option) {
  if (!alignment) return '';
  const DDIC = store.get('DDIC');
  let result = _.result(DDIC, alignment, option);
  if (typeof option === 'boolean' && option) {
    return _.isObject(result)
      ? _.map(result, (label, value) => ({ label, value }))
      : [];
  }
  return result;
}
function authorityTree(tree) {
  return tree.map(item => ({
    title: item.name,
    key: item.id,
    ...(item.children && item.children.length
      ? { children: authorityTree(item.children) }
      : {}),
  }));
}
function expandedKeysTree(tree, key = 'key') {
  if (!Array.isArray(tree)) return [];
  let expandedKeys = [];
  let temp = _.cloneDeep(tree);
  while (temp.length > 0) {
    let curr = temp.pop();
    if (Array.isArray(curr.children) && curr.children) {
      expandedKeys.push(curr[key]);
      temp = [].concat(temp, curr.children);
    }
  }
  return expandedKeys;
}
/**
 * 表单数据转换工具
 * @param {*} original 原始的表单数据
 * @param {*} format 需要格式化的配置
 * @param {*} format.replace key => key 替换键的配置
 * @param {*} format.transform number => 转字符串的配置
 */
function toFormData(original, format = {}) {
  if (!original instanceof Object) return {}

  let { replace = {}, transform = [] } = format;
  return Object.keys(original).reduce((obj, key) => {
    let item = original[key]; // 当前项目
    key = key in replace ? replace[key] : key; // 找出将对象的key转化的结果
    if (_.isArray(item)) { // 子元素为数组时
      item = item.map(d => _.isObject(d) ? toFormData(d, format) : d);
    } else if (_.isObject(item)) {
      item = toFormData(item, format);
    } else if (_.isNumber(item)) {
      item = transform.includes(key) ? item.toString() : (item === 0 ? undefined : item.toString());
    }
    return {
      ...obj,
      [key]: item,
    };
  }, {});
}
function deepSearch(tree, id) {
  let parent_id = 0;
  let currItem = null;
  let temp = _.cloneDeep(tree);
  while (temp.length > 0) {
    let curr = temp.shift();
    if (curr.id === id) {
      parent_id = curr.parent_id;
      temp = _.cloneDeep(tree);
      break;
    }
    if (curr.children && curr.children.length > 0) {
      temp = [].concat(temp, curr.children);
    }
  }
  while (temp.length > 0) {
    let curr = temp.shift();
    if (curr.id === parent_id) {
      currItem = curr;
      break;
    }
    if (curr.children && curr.children.length > 0) {
      temp = [].concat(temp, curr.children);
    }
  }
  return currItem;
}

/**
 * 根据上级部门ID 查找所在国家数组
 * @param {Array} tree 原始的表单数据
 * @param {String} groupId 深层查找要对比的上级部门ID
 * @param {Array} resArr 记录
 * @returns {Array}
 */
function deepSearchCountry(tree, groupId, resArr = []) {
  let result = resArr;
  for (let i = 0, len = tree.length; i < len; i++) {
    let curTreeItem = tree[i];
    if (curTreeItem.id == groupId) {
      result = curTreeItem.country_weight_ratio;
      break;
    }

    if (curTreeItem.id != groupId && curTreeItem.children.some(c => c?.id == groupId)) {
      result = [...curTreeItem.children.find(c => c?.id == groupId).country_weight_ratio, ...resArr];
    } else {
      result = deepSearchCountry(curTreeItem.children, groupId, result);
    }

  }
  return result;
}

/**
 *处理filter参数和地址查询参数的转换
 *@params {Object} params 需要转换的字段
 *@params {Object | Array} cfg 转换字段的配置
*/
function transferParams (params) {
  const result = {...params}
  return {
    // 从一个字段转化成两个字段请使用tactic
    tactic(cfg) {
      if(cfg.constructor === Object) {
        cfg = [cfg]
      } else if(!(cfg instanceof Array)) {
        throw Error()
        return this
      }
      cfg.forEach(item => {
        const { field='', to=[] } = item
        const [fieldOne, fieldTwo] = to
        const [valOne, valTwo] = result[field] || []
        result[fieldOne] = valOne
        result[fieldTwo] = valTwo
        delete result[field]
      })
      return this
    },
    // 从两个字段转化成一个字段请使用reverse
    reverse(cfg) {
      if(cfg.constructor === Object) {
        cfg = [cfg]
      } else if(!(cfg instanceof Array)) {
        throw Error()
        return this
      }
      cfg.forEach(item => {
        const { field='', to=[] } = item
        const [fieldOne, fieldTwo] = to

        const arrOne = result[fieldOne]
        const arrTwo = result[fieldTwo]
        if((arrOne === '' || arrOne === undefined) && (arrTwo === '' || arrTwo === undefined)) {
          result[field] = undefined
        } else {
          result[field] = [arrOne, arrTwo]
        }
        delete result[fieldOne]
        delete result[fieldTwo]
      })
      return this
    },
    // 获取转化后的值
    fetch() {
      return Object.keys(result).filter(key => (result[key] !== '' && result[key] !== undefined)).reduce((obj, cur) => {
        return { ...obj, [cur]: result[cur]}
      }, {})
    }
  }
}

/**
 *处理修改电话号码时，点了修改，显示隐私号码，输入后显示正常号码
 *@params {Boolean}  editable：  false 点了修改, true 取消修改
 *@params {Boolean}  isEiditing： true 开始输入状态，flase 未输入状态  
*/
function getSecretTelNum(tel = '', editable, isEiditing){
  if( !tel ) return '-';
  const isPreSales = window.location.pathname.includes('/pre-sales');

  if(isPreSales){
    const telLen = String(tel).length;
    const preShowLen = Math.floor(telLen / 3);
    const midHideLen = Math.ceil((telLen - preShowLen) / 2);
    const tailShowLen = telLen - preShowLen - midHideLen;
    const secretStr = ('*').repeat(midHideLen);
    const telReg = new RegExp(`(.{${preShowLen}}).*(.{${tailShowLen}})`, 'g') ;
    let result = tel; 

    if(!editable && !isEiditing){
      result = tel.replace(telReg, `$1${secretStr}$2`)
    }
    if(!editable && isEiditing){
      result = tel;
    }
    if(editable && !isEiditing){
      result = tel.replace(telReg, `$1${secretStr}$2`)
    } 
    return result;
  } 
  return tel;
}

export default {
  transferParams,
  traverseTree,
  getSecretTelNum,
  formatDDIC: memoizeOne(formatDDIC, _.isEqual),
  authorityTree: memoizeOne(authorityTree, _.isEqual),
  expandedKeysTree: memoizeOne(expandedKeysTree, _.isEqual),
  toFormData: memoizeOne(toFormData, _.isEqual),
  deepSearch: memoizeOne(deepSearch, _.isEqual),
  deepSearchCountry: memoizeOne(deepSearchCountry, _.isEqual),
};
