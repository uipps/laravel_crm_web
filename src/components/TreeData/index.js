import { Fragment, useState, useCallback, useEffect } from 'react'

import Item from './Item'
import './styles.less'

function generate(list, props = {
  parent: [],
  selectedKeys: [],
  onChange: () => {}
}) {
  return list.map(item => {
    return (
      <React.Fragment key={item.key}>
        <Item 
          {...item} 
          {...props}
          id={item.key} 
        />
        {
          (Array.isArray(item.children) && item.children.length > 0)
          && generate(item.children, {
            ...props,
            parent: [...props.parent, item.key]
          })
        }
      </React.Fragment>
    )
  })
}

export default function ({
  options,
  onChange,
  value
}) {
  let [selectedKeys, setKeys] = useState([])
  useEffect(() => {
    setKeys(value || [])
  }, [value])
  const onChangeCallback = useCallback(
    (checked, id, parent, childs) => {
      let _selectedKeys = selectedKeys
      if (checked) {
        _selectedKeys = Array.from(new Set([...childs, ...parent, ...selectedKeys, id]))
      } else {
        _selectedKeys = selectedKeys.filter(d => d !== id)
      }
      setKeys(_selectedKeys)
      onChange && onChange(_selectedKeys)
    },
    [selectedKeys],
  );
  return (
    <div>
      { 
        generate(options, {
          parent: [],
          childs: [],
          selectedKeys,
          onChange: onChangeCallback
        }) 
      }
    </div>
  )
}
 
