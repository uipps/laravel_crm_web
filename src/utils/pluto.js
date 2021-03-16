import numeral from 'numeral'
/**
 * 计算商品总金额
 * */ 
function countPrice(list) {
  return list.map(item => ({
    ...item,
    total_amount: Number(item.num) * Number(item.unit_price)
  }))
}

/**
 * 将活动规则转换为一个Map结构
 * @param {*} list 
 */
function flatActivitiy(list) {
  if (!list) return {}
  let tmp = list.reduce((prev, next) => {
    let { promotion_rules, ...item } = next
    return [
      ...prev,
      ...promotion_rules.map(d => ({ ...d, ...item }))
    ]
  }, [])
  return tmp.reduce((prev, next) => ({...prev, [next.rule_id]: next }), {})
}
/**
 * 
 * @param {*} rules 活动规则的数组
 * @param {*} goods 商品数组
 */
function doRule(rules, goods) {
  let rules_scope = rules.every(item => {
    if (item.rule_scope === 2) {
      let goods_nums = goods.map(d => d.num)
      return goods_nums.every(d => d >= item.min_num)
    }
    if (item.rule_scope === 1) {
      return item.min_num <= goods.reduce((pre, next) => pre + next.num, 0)
    }
  })
  let goods_scope = rules.some(item => {
    if (item.goods_scope === 1) return true
    if (item.goods_scope === 2) {
      return goods.every(d => item.promotion_goods_sku.includes(d.sku))
    }
  })
  return rules_scope && goods_scope
}

/**
 * 
 * @param {*} goods 商品数据
 * @param {*} dict 活动规则字典
 */
function tropeGoods (goods, dict) {
  goods = _.groupBy(goods, item => item.rule_ids && Object.keys(item.rule_ids).length ? Object.values(item.rule_ids) : '0') // 将商品数据分组

  // 转换分组
  goods = _.mapValues(goods, (args, key) => {
    if (key == 0)  {
      // 去掉原来存在的活动
      return args.map(({ rules, ...restItem}) => restItem)  // 不存在优惠活动分组
    }
    let rules = key.split(',').reduce((arr, rule_id) => rule_id in dict ? [...arr, dict[rule_id]] : arr, [])
    let expandable = {
      title: rules.map(d => `${d.name}:${d.rule_name}`).join(','),
      keys: rules.map(d => d.rule_id).join('-'),
      warn: doRule(rules, args)
    }
    return args.map(({ _expandable, ...item }, idx) => {
      item.rules = rules
      if (idx === 0 && rules.length > 0) {
        item._expandable = expandable
      }
      return item
    })
  }) // 转化优惠活动信息到商品数据中
 
  goods = _.reduce(goods, (result = [], value) => result.concat(value), []) 
  return goods.reduce((prev, next) => {
    let { _expandable, ...item } = next
    return [
      ...prev,
      ...(_expandable ? [{ id: `group_${_expandable.keys}`, _expandable}, item] : [item])
    ]
  }, [])
}
/**
 * 
 * @param {*} goodsInfo 
 * @param {*} known 
 * @param {*} dict 
 * orderAmount 订单总金额
 * goodsAmount 商品总金额
 * collectAmount 应收金额
 */
function calculate (goodsInfo, known = {}, dict) {
  let { receivedAmount = 0, discountAmount = 0, premiumAmount = 0 } = known
  let [orderAmount, goodsAmount, collectAmount] = [0, 0, 0]
  if (goodsInfo) {
    goodsAmount = goodsInfo.reduce((total, next) => next._expandable ? total : total + Number(next.total_amount), 0)
    if (dict) {
      goodsInfo = filter(goodsInfo)
      goodsInfo = _.groupBy(goodsInfo, item => item.rule_ids && Object.keys(item.rule_ids).length ?
        Object.values(item.rule_ids) : '0') // 将商品数据分组
      for (let key in goodsInfo) {
        let children = goodsInfo[key] || []
        let tmp =  children.reduce((total, child) => total + Number(child.total_amount), 0)
        if (key != 0) {
          let rules = key.split(',').reduce((pre, rule_id) => rule_id in dict ? [...pre, dict[rule_id]] : pre, [])
          if (doRule(rules, children)) {
            let discountRate = rules.reduce((rate, next) => rate * Number(next.discount), 1)
            collectAmount = collectAmount + (tmp * discountRate)
          } else {
            collectAmount = collectAmount + tmp
          }
        } else {
          collectAmount = collectAmount + tmp
        }
      }
      
      discountAmount = goodsAmount - collectAmount
      collectAmount = collectAmount - receivedAmount
      orderAmount = Number(receivedAmount) + collectAmount
    } else {
      collectAmount = Number(goodsAmount) - Number(discountAmount) - Number(receivedAmount) + Number(premiumAmount) 
      orderAmount = Number(receivedAmount) + Number(collectAmount)
    }
  }

 /*  orderAmount = orderAmount + Number(premiumAmount) -  - Number(discountAmount); */

  return {
    receivedAmount,
    discountAmount,
    premiumAmount,
    orderAmount,
    goodsAmount,
    collectAmount
  }
}
/**
 * 过滤一下表格数据额外的活动数据
 * @param {*} goods 
 */
function filter(goods = []) {
  return goods.filter(d => !d._expandable)
    .map(item => ({ ...item, rule_ids: Object.values(item.rule_ids || {})}) )
}

export default {
  countPrice,
  flatActivitiy,
  doRule,
  tropeGoods,
  calculate,
  filter
}
