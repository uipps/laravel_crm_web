import { DataSheet, Filter, IconFont, Picture } from '@/components'
import { useIntl, Link, useRequest, history } from 'umi'
import { Input, message, Modal } from 'antd'
import { useState, useEffect } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';

import services from '@/services';
import { basic, numeral } from '@/utils'

export default function() {
  const formatMessage = useIntl().formatMessage

  const filterItems = [
    {
      label: formatMessage({id: 'app.common.goodsName'}),
      type: 'input',
      id: 'product_name',
    },
    {
      label: formatMessage({id: 'app.common.sku'}),
      type: 'input',
      id: 'sku',
    },
  ]

  const columns = [
    {
      title: ' ',
      width: 74,
      dataIndex: 'pic_url',
      render(text) {
        return <Picture src={text} mode="aspectFit" width={58} height={58} />
      }
    },
    {
      title: formatMessage({id: 'app.common.goods'}),
      dataIndex: 'product_name',
      render(text, record) {
        return <a onClick={() => { onEditItem(record.id) }}>{text}</a>
      }
    },
    {
      title: formatMessage({id: 'app.common.spu'}),
      dataIndex: 'spu',
    },
    {
      title: formatMessage({id: 'app.common.retailPrice'}),
      dataIndex: 'sell_price',
      align: 'right',
      render: v => numeral(v).format('0,0.00'),
    },
    // {
    //   title: formatMessage({id: 'app.common.goodsPrice'}),
    //   dataIndex: 'unit_price',
    //   align: 'right',
    //   render: v => numeral(v).format('0,0.00'),
    // },
    {
      title: formatMessage({id: 'app.global.state'}),
      dataIndex: 'status',
      align: 'center',
      render(text) {
        return <span style={{color: String(text) === '1' ? '#61B51C' : ''}}>{basic.formatDDIC(`promotion.status.${text}`, '-')}</span>
      }
    },
    {
      title: formatMessage({id: 'app.global.action'}),
      dataIndex: 'n',
      align: 'center',
      render(text, record) {
        return (
          <>
            <a style={{marginRight: 16}} onClick={() => { onEditItem(record.id) }}>{formatMessage({id: 'app.global.modify'})}</a>
            <a onClick={() => { onDelItem(record) }}>{formatMessage({id: 'app.global.delete'})}</a>
          </>
        )
      }
    },
  ]

  const { pathname, query } = history.location

  // 请求活动列表
  const { data: data, run: runQueryList, params: oldParams, loading } = useRequest(() => {
    return services.goodsList(query, {})
  }, {
    refreshDeps: [query],
  })

  // 请求删除一项
  const { run: runDelItem } = useRequest(services.goodsDelete, {
    manual: true,
    onSuccess() {
      message.success(
        formatMessage({id: 'app.message.delete.success'}),
        2,
      )
      runQueryList(oldParams).then()
    }
  })

  // 批量导入
  const { run: runAddGoods } = useRequest(services.goodsAdd, {
    manual: true,
    onSuccess() {
      message.success({
        content: formatMessage({id: 'app.message.add.success'}),
        duration: 2,
        onClose() {
          history.push(pathname)
        },
        key: 'batchAdd'
      });

      setModalVisible(false)
    }
  })

  const handlerFilterSubmit = (values) => {
    history.push({
      pathname,
      query: values
    })
  }

  const handlerPageChange = (current) => {
    history.push({
      pathname,
      query: { ...query, ...current }
    })
  }

  const onDelItem = ({ id, status }) => {
    if(status === 1) {
      Modal.warning({
        content: formatMessage({id: 'app.common.goodsDeleteWarn'}),
      })
    }
    if(status === 0) {
      Modal.confirm({
        content: formatMessage({id: 'app.common.goodsDeleteConfirm'}),
        icon: <ExclamationCircleOutlined />,
        onOk() {
          runDelItem({id}).then()
        },
        okText: formatMessage({id: 'app.global.ok'}),
        cancelText: formatMessage({id: 'app.global.cancel'}),
      })
    }
  }

  const onEditItem = (id) => {
    history.push(`/after-sales/product/goods/${id}`)
  }

  // 控制模态框的显示和隐藏
  const [ modalVisible, setModalVisible ] = useState(false)

  // 文本框的值
  const [ textInfo, setTextInfo ] = useState('')

  useEffect(() => {
    setTextInfo('')
  }, [modalVisible]);

  const handleAddOk = () => {
    // 校验为空值时
    if (/^[\s\n\r]*$/.test(textInfo)) {
      Modal.warning({
        content: formatMessage({id: 'app.common.placeholder.goodsIdsEmpty'}),
        okText: formatMessage({id: 'app.global.close'})
      })
      return
    }
    // 检验值不符合规范时
    if(!/^[\d\s\n\r]+$/.test(textInfo)) {
      Modal.warning({
        content: formatMessage({id: 'app.common.goodsIdsError'}),
        okText: formatMessage({id: 'app.global.close'})
      })
      return;
    }

    const erp_product_ids = textInfo.replace(/[\s\r\n]+/g, ',').split(',').filter(i => !!i)
    runAddGoods({ erp_product_ids }).then()

    // loading状态
    message.loading({ content: formatMessage({id: 'app.message.submitting'}), key: 'batchAdd'});
  }

  const handlerTextChange = ({ currentTarget }) => {
    const value = currentTarget.value.replace(/[\s\r\n]+/g, '\n').replace(/^[\n]/, '')
    setTextInfo(value)
  }

  const handleAddCancel = () => {
    setModalVisible(false)
  }

  return(
    <>
      <Filter
        items={filterItems}
        onSubmit={handlerFilterSubmit}
        values={query}
        style={{marginBottom: 16}}
      />

      <DataSheet
        dataSource={data?.list ?? []}
        columns={columns}
        pagination={data?.pagination ?? {}}
        onChange={handlerPageChange}
        loading={loading}
        extra={[
          {
            title: formatMessage({id: 'app.common.addGoods'}),
            icon: <IconFont type="icon-plus" color="fff" />,
            type: 'primary',
            onClick() {
              history.push('/after-sales/product/goods/add')
            }
          },
          {
            title: formatMessage({id: 'app.common.addGoodsBatch'}),
            icon: <IconFont type="icon-plus" color="fff" />,
            type: 'primary',
            onClick() {
              setModalVisible(true)
            }
          }
        ]}
      />

      <Modal
        title={formatMessage({id: 'app.common.addGoodsBatch'})}
        visible={modalVisible}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
      >
        <Input.TextArea
          rows={12}
          placeholder={formatMessage({id: 'app.common.placeholder.goodsBatchAdd'})}
          value={textInfo}
          onChange={handlerTextChange}
        />
      </Modal>
    </>
  )
}
