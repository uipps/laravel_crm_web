
export default class Explain {
  #tableColumns = []
  #tableFilter = []
  #tableHeader = {}
  #tableFooter = {}
  #ruleKey = null
  constructor(obj) {
    const original = {
      columns: [],
      filter: [],
      header: {},
      footer: {}
    }
    for (let key in obj) {
      if (key in original) {
        original[key] = obj[key]
      }
    }
    this.#tableColumns = original.columns
    this.#tableFilter = original.filter
    this.#tableHeader = original.header
    this.#tableFooter = original.footer
  }
  setRuleKey(ruleKey) {
    this.#ruleKey = ruleKey
    return this
  }
  setFormatMessage(formatMessage) {
    this.formatMessage = formatMessage
    return this
  }
  getRule(rules) {
    return rules.reduce((obj, next) => {
      if (Array.isArray(next)) {
        let [key, fn = v => v] = next
        return {
          ...obj,
          [key]: next[1]
        }
      }
      return {
        ...obj,
        [next]: undefined
      }
    }, {})
  }
  /**
   * 表格 Columns生成器
   * @param {*} data 动态的数据
   */
  generateColumns(data) {
    return this.#tableColumns.reduce((arr, {
      rules,
      render = v => v,
      ...item
    }) => {
      rules = this.getRule(rules)
      if (!(this.#ruleKey in rules)) return arr
      let itemRender = rules[this.#ruleKey]
      return [
        ...arr,
        {
          ...item,
          title: this.formatMessage ? this.formatMessage({ id: item.title }) : item.title,
          render: (...args) => typeof itemRender === 'function' ? 
            itemRender(...args, { ...data, formatMessage: this.formatMessage }) 
            : render(...args, { ...data, formatMessage: this.formatMessage })
        }
      ]

    }, [])
  }
  generateHeader(data) {
    let callback = this.#ruleKey in this.#tableHeader ? this.#tableHeader[this.#ruleKey] : function() {}
    let params = { ...data, formatMessage:  this.formatMessage }
    return callback(params)
  }
  generateFooter(data) {
    let callback = this.#ruleKey in this.#tableFooter ? this.#tableFooter[this.#ruleKey] : function() {}
    let params = { ...data, formatMessage:  this.formatMessage }
    return callback(params)
  }
  generateFilter(data) {
    return this.#tableFilter.reduce((arr, {
      rules,
      ...item
    }) => {
      rules = this.getRule(rules)
      if (!(this.#ruleKey in rules)) return arr
      let itemRender = rules[this.#ruleKey] || function(d) { return d }
      return [
        ...arr,
        itemRender({
          ...item,
          ...(
            item.placeholder ? {
             placeholder: this.formatMessage({ id: item.placeholder })
            } : {}
          ),
          label: this.formatMessage ? this.formatMessage({ id: item.label }) : item.label,
        }, data)
      ]

    }, [])
  }
  generate (data) {
    return {
      columns: this.generateColumns(data),
      header: this.generateHeader(data),
      footer: this.generateFooter(data),
      filter: this.generateFilter(data)
    }
  }
}
