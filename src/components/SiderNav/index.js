import React, { PureComponent } from 'react'
import { Icon, Badge } from 'antd'
import classnames from 'classnames'
import './style.less'
/* const assets = [
  {
    key: '1',
    icon: 'pie-chart',
    label: '测试菜单1',
    option: [
      { key: '1-1', name: '测试菜单1-1'},
      { key: '1-2', name: '测试菜单1-2'},
      { key: '1-3', name: '测试菜单1-3'},
      { key: '1-4', name: '测试菜单1-4'},
    ]
  }, {
    key: '2',
    icon: 'dot-chart',
    label: '测试菜单2',
    option: [
      { key: '2-1', name: '测试菜单2-1'},
      { key: '2-2', name: '测试菜单2-2'},
      { key: '2-3', name: '测试菜单2-3'},
      { key: '2-4', name: '测试菜单2-4'},
    ]
  }, {
    key: '3',
    icon: 'radar-chart',
    label: '测试菜单3',
    option: [
      { key: '3-1', name: '测试菜单3-1'},
      { key: '3-2', name: '测试菜单3-2'},
      { key: '3-3', name: '测试菜单3-3'},
      { key: '3-4', name: '测试菜单3-4'},
    ]
  }
] */
export default class extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      parentKey: '',
      selectKey: '',
      activedKey: '',
      checkedKey: '',
      option: []
    }
  }
  componentDidMount() {
    const { selectedKeys } = this.props
    const [parentKey, selectKey, activedKey] = selectedKeys
    this.setState({
      parentKey,
      selectKey,
      activedKey
    })
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.selectedKeys) !== JSON.stringify(this.props.selectedKeys)) {
      const [parentKey, selectKey, activedKey] = nextProps.selectedKeys
      this.setState({
        parentKey,
        selectKey,
        activedKey
      })
    }
  }

  onItemClick = (item, e) => {
    this.setState({
      selectKey: item.key
    }, () => {
      const { parentKey, selectKey, activedKey } = this.state
      const { onClick } = this.props
      onClick && onClick([parentKey, selectKey, activedKey])
    })
  }

  onOptionClick = (item, e) => {
    if (item.option) return
    this.setState({
      activedKey: item.key,
      checkedKey: ''
    })
  }

  onChildClick = (item, parent) => {
    this.setState({
      activedKey: parent.key,
      checkedKey: item.key
    })
  }

  renderOption(option, parent) {
    const { checkedKey } = this.state
    return Array.isArray(option) && (
      <ul className="crm-navs--children">
        {
          option.map(item => (
            <li
              key={item.key}
              className={
                classnames('crm-navs--children-item', {
                  'crm-navs--children__checked': String(item.key) === String(checkedKey)
                })
              }
            >
                <div
                  className="crm-navs__title"
                  onClick={(e) => this.onChildClick(item, parent)}
                >
                  {item.name}
                  {'badge' in item && <Badge count={item.badge} color={item.color} />}
                </div>
            </li>
           )
          )
        }
      </ul>
    )
  }
  render() {
    const { selectKey, activedKey, checkedKey } = this.state
    const { assets } = this.props
    const current = Array.isArray(assets) ? assets.find(d => String(d.key) === String(selectKey)) : {}
    const { name, option = [] } = current || {}
    return (
      <div className="crm-navs">
        <ul>
          {
            Array.isArray(assets) && assets.map(({ option, ...item }, idx) => (
              <li
                key={item.key}
                onClick={e => this.onItemClick({ option, ...item }, e)}
                className={classnames('crm-navs-item', {
                  'crm-navs-item-actived': String(selectKey) === String(item.key)
                })}
              >
                <span>
                  <Icon type={item.icon} />
                </span>
              </li>
            ))
          }
        </ul>
        {
          option.length > 0 && (
            <div className="crm-navs--option">
              <div className="crm-navs--option-label">
              {name}
              </div>
              <ul>
                {
                  option.map(item => (
                    <li
                      key={item.key}
                      className={classnames('crm-navs--option-item', {
                        'crm-navs--option__actived': !checkedKey && String(activedKey) === String(item.key)
                      })}
                    >
                      <div
                        className="crm-navs__title"
                        onClick={(e) =>  this.onOptionClick(item, e)}
                      >
                        {item.name}
                        {'badge' in item && <Badge count={item.badge} color={item.color} />}
                      </div>
                      { this.renderOption(item.option, item) }
                    </li>
                  ))
                }
              </ul>
            </div>
          )
        }
      </div>
    )
  }
}
