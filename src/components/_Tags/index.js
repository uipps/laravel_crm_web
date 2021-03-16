import { Button, Tag, message } from 'antd';
import { useIntl, useRequest, useParams, history } from 'umi';
import { FieldSelect, IconFont } from '@/components'
import { basic, _ } from '@/utils';
import services from '@/services';
import { useState } from 'react'

const defaultStyle = {
  marginRight: '16px',
};
const colorCfg = [
  {
    ...defaultStyle,
    color: '#9CCC65',
    borderColor: '#9CCC65',
  },
  {
    ...defaultStyle,
    color: '#61B51C',
    borderColor: '#61B51C',
  },
  {
    ...defaultStyle,
    color: '#04C9E2',
    borderColor: '#04C9E2',
  },
  {
    ...defaultStyle,
    color: '#FFC300',
    borderColor: '#FFC300',
  },
  {
    ...defaultStyle,
    color: '#FF3728',
    borderColor: '#FF3728',
  },
];

export default function() {
  const formatMessage = useIntl().formatMessage;

  const { pathname } = history.location

  // 是否是售后
  const afterSales = pathname.includes('/after-sales')

  let options = basic.formatDDIC('customer_clue.quality_level', true)
  options = options.map(e => ({...e, name: formatMessage({ id: 'app.common.qualityLevel' }) + e.label }))

  const matchParams = useParams()

  // select的值
  const [selectVal, setSelectVal] = useState(undefined)

  // 是否是编辑状态
  const [ editTag, setEditTag ] = useState(false)

  // 请求客户标签
  const { data, run: runQueryTags } = useRequest(services.customerTags, {
    defaultParams: [{ customer_id: matchParams.id }]
  });
  // 保存编辑的标签
  const { run: runTagEdit, loading: loadingEdit } = useRequest(services.customerTagsEdit, {
    manual: true,
    onSuccess() {
      message.success(formatMessage({id: 'app.message.save.success'}), 2)
      setEditTag(false)
      runQueryTags({ customer_id: matchParams.id }).then()
    }
  })

  const handlerSelectChange = (val) => {
    setSelectVal(val)
  }

  const onSaveTag = () => {
    if(!selectVal) {
      message.warn(formatMessage({id: 'app.message.selectQualityLevel'}), 2)
      return
    }
    runTagEdit({customer_id: matchParams.id, label_value:selectVal }).then()
  }

  return (
    <div className="tags">
      {Array.isArray(data?.list) &&
        data.list.map((item, index) => {
          if (item.label_type !== 5) {
            return (
              <Tag size="small" key={index} style={colorCfg[index]}>
                {item.label_value}
              </Tag>
            );
          }
          return (
            <Tag
              size="small"
              key={index}
              style={{...defaultStyle}}
            >
              {formatMessage({ id: 'app.common.qualityLevel' })}：
              {item.label_value}
            </Tag>
          );
        }
      )}

      {afterSales && !editTag &&
        <Button
          type="link"
          size="small"
          icon={<IconFont type="icon-edit-square" />}
          onClick={() => setEditTag(true)}
        >
          {formatMessage({id: 'app.common.manageTag'})}
        </Button>
      }
      {afterSales && editTag &&
        <>
          {/* 选择标签 */}
          <FieldSelect
            value={selectVal}
            size="small"
            placeholder={formatMessage({id: 'app.common.qualityLevel'})}
            option={options}
            onChange={handlerSelectChange}
            style={{...defaultStyle}}
          />
          {/* 保存标签 */}
          <Button style={{...defaultStyle}}
            size="small"
            type="primary"
            onClick={_.throttle(onSaveTag, 2000, { pending: true, trailing: false })}
            loading={loadingEdit}
          >
            {formatMessage({id: 'app.common.saveTag'})}
          </Button>
          {/* 取消 */}
          <Button
            size="small"
            onClick={() => setEditTag(false)}
          >
            {formatMessage({id: 'app.global.cancel'})}
          </Button>
        </>
      }

    </div>
  );
}
