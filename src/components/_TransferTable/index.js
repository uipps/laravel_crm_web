import { useState, useEffect } from 'react'
import { _SelectService, DataSheet } from '@/components';
import { useIntl, useModel } from 'umi'
import { Button, message } from 'antd'

export default function(props) {
  const { dataSource=[], onDistributionTo, mode, transferDesc={}, module } = props

  const formatMessage = useIntl().formatMessage

  const { _selectService } = useModel('modal')

  useEffect(() => {
    setSelectedRowKeys([])
  }, [dataSource]);

  // 选择的表格行
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const  handlerSelectedChange = (keys) => {
    setSelectedRowKeys(keys)
  }

  // 全选和全不选
  const onCheckedAll = () => {
    if (selectedRowKeys.length === dataSource.length) {
      setSelectedRowKeys([])
    } else {
      const keys = dataSource.map(e => e.id)
      setSelectedRowKeys(keys)
    }
  }

  // 选择选项后
  const handlerSubmit = ({id}) => {
    onDistributionTo && onDistributionTo(id, selectedRowKeys)
  }

  // 打开模态框
  const openModal = () => {
    // 如果选择了多种语言就提示
    const ids = [...(new Set(checkLanguages))]
    if(ids.length !== 1) {
      message.warn(formatMessage({id: 'app.common.needSelectLanguage'}))
      return
    }
    _selectService.setVisible(true)
  }

  // 选中客户的语言
  const checkLanguages = dataSource.filter(item => selectedRowKeys.includes(item.id)).map(v => String(v.language_id))

  return(
    <>
      <DataSheet
        {
          ...mode === 'customer'
            ? {
                rowSelection: {
                  selectedRowKeys: selectedRowKeys,
                  onChange: handlerSelectedChange,
                },
                action: <>
                  <Button onClick={onCheckedAll} disabled={!dataSource.length}>
                    {formatMessage({
                      id: `app.global.${selectedRowKeys.length === dataSource.length &&  selectedRowKeys.length ? 'uncheck-all' : 'check-all'}`
                    })}
                  </Button>
                  <Button onClick={openModal} disabled={!selectedRowKeys.length}>
                    {transferDesc.title || formatMessage({id: 'app.common.assignedTo'})}
                  </Button>
                </>
              }
              : {}
        }
        {
          ...props
        }
      />

      {mode === 'customer' &&
        <_SelectService
          module={module}
          onSubmit={handlerSubmit}
          title={transferDesc.title || formatMessage({id: 'app.common.assignedTo'})}
          desc={transferDesc.desc}
          serviceNeedLangIds={checkLanguages}
          params={{ is_clue_sale: 0 }}
          disabledLanguage
        />
      }
    </>
  )
}
