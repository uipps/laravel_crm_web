import { TreeSelect } from 'antd'

export default function(props) {
  const {
    value,
    mapValue = 'value',
    mapName = 'label',
    mapChild = 'children',
    options,
    treeDefaultExpandAll=true,
    ...extendProps
  } = props

  const formatData = (options) => {
    if(!Array.isArray(options)) return []

    return options.map(item => ({
      title: item[mapName],
      value: String(item[mapValue]),
      children: formatData(item[mapChild]),
    }))
  }

  return (
    <TreeSelect
      treeDefaultExpandAll={treeDefaultExpandAll}
      {
        ...options.length
        ? {
            value,
            treeData: formatData(options)
          }
        : {}
      }
      {...extendProps}
    />
  )
}
