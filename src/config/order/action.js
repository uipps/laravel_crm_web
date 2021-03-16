import { Button } from 'antd'
import { useIntl } from 'umi'

export default {
  list_distribute_not: ({ emitter, data }) => {
    let { formatMessage } = useIntl();
    let { selectedKeys, allKeys } = data
    let allStatus = allKeys.length && allKeys.length === selectedKeys.length
    return (
      <>
        <Button
          onClick={() => emitter.emit(allStatus ? 'deselect-all' : 'select-all')}
        >
          {allStatus ? formatMessage({ id: 'app.global.uncheck-all' }) : formatMessage({ id: 'app.global.check-all' })}
        </Button>
        <Button
          disabled={!selectedKeys.length}
          onClick={() => emitter.emit('select-staff')}
        >
          {formatMessage({ id: 'app.common.distribute' })}
        </Button>
      </>
    )
  },
  list_distributed: ({ emitter, data }) => {
    let { selectedKeys, allKeys } = data
    let allStatus = allKeys.length && allKeys.length === selectedKeys.length
    return (
      <>
        <Button
          onClick={() => emitter.emit(allStatus ? 'deselect-all' : 'select-all')}
        >
          {allStatus ? formatMessage({ id: 'app.global.uncheck-all' }) : formatMessage({ id: 'app.global.check-all' })}}
        </Button>
        <Button
          disabled={!selectedKeys.length}
          onClick={() => emitter.emit('cancel-distributed')}
        >
          {formatMessage({ id: 'app.common.archive' })}
        </Button>
      </>
    )
  },
  // 取消成功订单
  askforcancel_cancel_succ: ({ emitter, data }) => {
    let { selectedKeys, allKeys } = data
    let allStatus = allKeys.length && allKeys.length === selectedKeys.length
    return (
      <>
        <Button
          onClick={() => emitter.emit(allStatus ? 'deselect-all' : 'select-all')}
        >
          {allStatus ? formatMessage({ id: 'app.global.uncheck-all' }) : formatMessage({ id: 'app.global.check-all' })}}
        </Button>
        <Button
          disabled={!selectedKeys.length}
          onClick={() => emitter.emit('archive-file')}
        >
          {formatMessage({ id: 'app.common.archive' })}
        </Button>
      </>
    )
  },
  // 取消成功订单
  askforcancel_cancel_fail: ({ emitter, data }) => {
    let { selectedKeys, allKeys } = data
    let allStatus = allKeys.length && allKeys.length === selectedKeys.length
    return (
      <>
        <Button
          onClick={() => emitter.emit(allStatus ? 'deselect-all' : 'select-all')}
        >
          {allStatus ? formatMessage({ id: 'app.global.uncheck-all' }) : formatMessage({ id: 'app.global.check-all' })}}
        </Button>
        <Button
          disabled={!selectedKeys.length}
          onClick={() => emitter.emit('archive-file')}
        >
          {formatMessage({ id: 'app.common.archive' })}
        </Button>
      </>
    )
  },

}