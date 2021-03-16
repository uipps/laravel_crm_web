import React from 'react'
import ReactDOM from 'react-dom'
import { Modal } from 'antd'
import { FormattedMessage, useIntl } from 'umi'
import IconFont from '../IconFont'
import styles from './styles.less'


const confirm = ({
  message,
  ...props
}) => {
  Modal.confirm({
    ...props,
    title: message,
    content: null,
    width: 580,
    maskClosable: true,
    className: styles.dialog,
    icon: (
      <div className={styles.confirmIcon}>
        <IconFont type="icon-question-circle-o" />
      </div>
    )
  })
}
const success = ({
  message,
  ...props
}) => {
  const { formatMessage } = useIntl(); // 语言包国际化方案函数
  Modal.confirm({
    ...props,
    title: formatMessage({id: 'app.message.successful'}),
    content: message,
    width: 580,
    maskClosable: true,
    className: styles.dialog,
    icon: (
      <div className={styles.successIcon}>
        <IconFont type="icon-check-circle" />
      </div>
    ),
  })
}
const closeModal = () => {
  Modal.destroyAll();
}
export default {
  confirm,
  success,
  closeModal
}