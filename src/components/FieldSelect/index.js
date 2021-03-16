import { Select } from 'antd';

export default function({
  option = [],
  renderItem,
  mapValue = 'value',
  mapName = 'name',
  mapChild = 'children',
  mapChildValue = 'id',
  mapChildName = 'name',
  mapChildRest,
  ...props
}) {
  // 把value也格式化成String类型
  if(Array.isArray(props.value)) {
    props.value = props.value.map(v => String(v))
  }

  return (
    <Select {...props}>
      {option.map((item, idx) =>  {
        let children = item[mapChild]
        if (Array.isArray(children)) {
          return (
            <Select.OptGroup key={item.id} label={item[mapName]}>
              {
                children.map(citem => (
                  <Select.Option
                    key={citem[mapChildValue]}
                    value={String(citem[mapChildValue])}
                    disabled={!!citem.disabled}
                    {...(mapChildRest ? { [mapChildRest]: citem[mapChildRest] } : {})}
                  >
                    {citem[mapChildName]}
                  </Select.Option>
                ))
              }
            </Select.OptGroup>
          )
        } else {
          return (
            <Select.Option
              key={item[mapValue]} disabled={!!item.disabled}>
              {typeof renderItem === 'function' ? renderItem(item[mapName], item) : item[mapName]}
            </Select.Option>
          )
        }
      })}
    </Select>
  );
}
