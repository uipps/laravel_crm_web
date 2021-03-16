import { _TransferTable } from '@/components';
import { useIntl, useRequest, useParams, useModel, Link } from 'umi'
import services from '@/services';
import { useState } from 'react'
import { basic } from '@/utils';
import './styles/customer.less'
import { message } from 'antd'

export default function(props) {
  const formatMessage = useIntl().formatMessage

  // 账号信息
  const { account } = useModel('@@initialState').initialState

  const columns = [
    {
      title: formatMessage({id: 'app.common.customerId'}),
      dataIndex: 'id',
    },
    {
      title: formatMessage({id: 'app.common.customerName'}),
      dataIndex: 'customer_name',
    },
    {
      title: formatMessage({id: 'app.common.phoneNumber'}),
      dataIndex: 'tel',
    },
    {
      title: formatMessage({id: 'app.common.country'}),
      dataIndex: 'country_name',
    },
    {
      title: formatMessage({id: 'app.common.language'}),
      dataIndex: 'language_name',
    },
    {
      title: formatMessage({id: 'app.common.customerQuality'}),
      dataIndex: 'quality_level',
      align: 'center',
      render(text) {
        return basic.formatDDIC('order.quality_level', {})[text]
      }
    },
    {
      title: formatMessage({id: 'app.common.createDate'}),
      dataIndex: 'created_time',
      align: 'center',
    },
    {
      title: formatMessage({id: 'app.common.orderNumber'}),
      dataIndex: 'order_num',
      align: 'center',
    },
    {
      title: formatMessage({id: 'app.common.customerSource'}),
      dataIndex: 'source_type',
      render(t) {
        return basic.formatDDIC(`order.source_type.${t}`, '-')
      }
    },
    {
      title: formatMessage({id: 'app.global.action'}),
      dataIndex: 'opt',
      align: 'center',
      render(text, record) {
        const path = account.job_type === 2  ? `/after-sales/customer/${record.id}/info` : `/pre-sales/customer/${record.id}/info`
        return(
          <Link to={path}>
            {formatMessage({id: 'app.global.see'})}
          </Link>
        )
      }
    },
  ]

  // 是否有转移客户的权限
  const capable = account.job_type === 2

  const match = useParams()

  const { data, loading, run: runQueryList } = useRequest(services.staffCustomer, {
      defaultParams: [{ user_id: match.id }]
  })

  // 转移客户
  const { run: runOrderTransfer } = useRequest(services.staffCustomerTransfer, {
    manual: true,
    onSuccess() {
      runQueryList({ user_id: match.id }).then()
      message.success(formatMessage({id: 'app.message.transfer.success'}));
    }
  })

  const handlerPageChange = (current) => {
    const params = {
      user_id: match.id,
      ...current
    }
    runQueryList({...params}).then()
  }

  const handlerSubmit = (id, selectedRowKeys) => {
    const params = {
      source_user_id: match.id,
      to_user_id: id,
      customer_ids: selectedRowKeys,
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
        desc: formatMessage({id: 'app.common.needTransferCustomer'}),
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
