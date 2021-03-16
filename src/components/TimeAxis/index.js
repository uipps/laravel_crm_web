import './style.less';
import { _ } from '@/utils'

export default function(props) {
  let {
    dataSource = [],
    label="created_time",
    wrapper={
      title: 'creator_name',
      content: 'remark'
    },
    isCut=true
  } = props;

  const data =  _.groupBy(dataSource, label)
  const cutFn = key => isCut ? key.split(' ').map(v => <div key={v}>{v}</div>) : key

  return (
    <div className="ta">
      {Object.keys(data).map(key => {
        return data[key].map((item, index) => (
          <div className="ta__item" key={item?.id ?? key+index}>
            <div className="ta__item--date">
              {index === 0 && cutFn(key)}
            </div>

            <div className="ta__item--staff" />

            <div className="ta__item--text">
              {typeof wrapper === 'object' &&
              <>
                <div>
                  {typeof wrapper.title === 'function'
                    ? wrapper.title(item)
                    : item[wrapper.title] ? `${item[wrapper.title]}：` : ''
                  }
                </div>
                <div>
                  {typeof wrapper.content === 'function'
                    ? wrapper.content(item)
                    : item[wrapper.content]
                  }
                </div>
              </>
              }
              {typeof wrapper === 'function' &&
                wrapper(item)
              }
            </div>
          </div>
        ))
      })}
    </div>
  );
}
