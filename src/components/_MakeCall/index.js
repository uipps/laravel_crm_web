import { useIntl, useModel } from 'umi'
import { Modal, Form } from 'antd'
import { useEffect } from 'react'
import { basic } from '@/utils'
export default function (props) {
  const { formatMessage } = useIntl()
  const { visible, data, setCancel, runCall } = useModel('call')
  return (
    <Modal
      visible={visible}
      width={450}
      title={formatMessage({ id: 'app.common.makeCalls' })}
      cancelText={formatMessage({ id: 'app.global.cancel' })}
      okText={formatMessage({ id: 'app.common.makeCalls' })}
      onCancel={() => setCancel()}
      onOk={() => runCall({ ...data })}
    >
      <Form>
        <Form.Item label={formatMessage({ id: 'app.common.fullName' })}>
          <span>{data.customer_name}</span>
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'app.common.phone' })}>
          <span>{basic.getSecretTelNum(data.tel)}</span>
        </Form.Item>
      </Form>
    </Modal>
  )
}