import { Checkbox } from 'antd'

export default function Item ({ 
  id, 
  title, 
  parent = [], 
  selectedKeys,
  children = [],
  onChange = () => {} 
}) {
  const onChangeCallback = (e) => {
    let checked = e.target.checked
    let ids = []
    let _childs = [].concat(children)
    while(_childs.length > 0) {
      let item = _childs.shift()
      ids.push(item.key)
      if (Array.isArray(item.children) && item.children.length > 0) {
        _childs = [].concat(_childs, item.children)
      }
    }
    onChange(checked, id, parent, ids)
  }
  return (
    <div className="tree-item">
      <span className="tree-indent">
        {
          parent.map(d => <span className="tree-indent__item" key={d} />)
        }
      </span>
      <span className="tree-checkbox">
        <Checkbox 
          checked={selectedKeys.includes(id)}
          onChange={onChangeCallback}
        >
          {title}
        </Checkbox>
      </span>
    </div>
  )
}