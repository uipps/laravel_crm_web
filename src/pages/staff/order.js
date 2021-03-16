import { useState } from 'react'
import { _TransferTable } from '@/components';
import { useIntl, useRequest, useParams, useModel } from 'umi'
import services from '@/services';
import { message } from 'antd'
import { Explain } from '@/utils'
import orderCfg from '@/config/order'
const explain = new Explain(orderCfg)

export default function() {
  const formatMessage = useIntl().formatMessage

  const { columns } = explain.setRuleKey('staff_order').setFormatMessage(formatMessage).generate()

  const match = useParams()

  // 账号信息
  const { account } = useModel('@@initialState').initialState

  // 是否有转移订单的权限
  const capable = account.job_type === 1

  // 请求订单列表
  const { data, loading, run: runOrderList  } = useRequest(services.staffOrder, {
    defaultParams: [{ user_id: match.id }],
  })

  // 转移订单
  const { run: runOrderTransfer } = useRequest(services.staffOrderTransfer, {
    manual: true,
    onSuccess() {
      runOrderList({ user_id: match.id }).then()
      message.success(formatMessage({id: 'app.message.transfer.success'}));
    }
  })

  const handlerPageChange = (current) => {
    const params = {
      user_id: match.id,
      ...current
    }
    runOrderList(params).then()
  }

  const handlerSubmit = (id, selectedRowKeys) => {
    const params = {
      source_user_id: match.id,
      to_user_id: id,
      order_ids: selectedRowKeys,
    }
    runOrderTransfer(params).then()
  }

  return(
    <_TransferTable
      columns={columns}
      dataSource={data?.list ?? []}
      pagination={data?.pagination ?? {}}
      onChange={handlerPageChange}
      loading={loading}
      transferDesc={{
        title: formatMessage({id: 'app.common.transferTo'}),
        desc: formatMessage({id: 'app.common.needTransferOrder'}),
      }}
      {
        ...capable
        ? {
          mode: 'customer',
          onDistributionTo: handlerSubmit
        }
        :{}
      }
    />
  )
}
