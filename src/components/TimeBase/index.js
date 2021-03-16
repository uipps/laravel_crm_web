import { Timeline } from 'antd'
import { _ } from '@/utils'
import style from './style.less'

export default function ({
  timeKey = 'opt_time',
  descKey = 'opt_type_name',
  dataSource = [],
  mode = 'left',
  isCut = true
}) {
  let data = _.groupBy(dataSource, timeKey)
  const cutFn = keys => isCut ? keys.split(' ').map(v => <span key={v}>{v}</span>) : keys
  return (
    <Timeline mode={mode}>
      {
        Object.keys(data).map(key => {
          let item = data[key]
          return item.map((child, index) => (
            <Timeline.Item 
              className={isCut && style.item}
              label={index === 0 ? cutFn(key) : null}
            >
              {child[descKey]}
            </Timeline.Item>
          ))                      
        })
      }
    </Timeline>
  )
}