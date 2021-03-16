import { Button } from 'antd'
export default {
  distribute_not: ({ 
    formatMessage,
    eventEmitter, 
    selectedKeys,
    allKeys 
  }) => {
    let emitterKey = selectedKeys.length !== allKeys.length ?  'check-all' : 'uncheck-all'
    return (
      <>
        <Button
          onClick={() => eventEmitter.emit(emitterKey)}
        >
          {formatMessage({ id: `app.global.${emitterKey}`})}
        </Button>
        <Button
          disabled={!selectedKeys.length}
          onClick={() => eventEmitter.emit('order-distributed-staff')}
        >
          {formatMessage({ id: 'app.common.distribute', defaultMessage: '分配' })}
        </Button>
      </>
    )
  },
  distributed: ({ 
    formatMessage,
    eventEmitter, 
    selectedKeys,
    allKeys 
  }) => {
    let emitterKey = selectedKeys.length !== allKeys.length ?  'check-all' : 'uncheck-all'
    return (
      <>
        <Button
          onClick={() => eventEmitter.emit(emitterKey)}
        >
          {formatMessage({ id: `app.global.${emitterKey}`})}
        </Button>
        <Button
          disabled={!selectedKeys.length}
          onClick={() => eventEmitter.emit('cancel-distributed')}
        >
          { formatMessage({ id: 'app.common.repealDistribute', defaultMessage: '撤销分配' })}
          
        </Button>
      </>
    )
  },
  // 取消成功订单
  askforcancel_cancel_succ: ({ 
    formatMessage,
    eventEmitter, 
    selectedKeys,
    allKeys 
   }) => {
    let emitterKey = selectedKeys.length !== allKeys.length ?  'check-all' : 'uncheck-all'
    return (
      <>
        <Button
          onClick={() => eventEmitter.emit(emitterKey)}
        >
          {formatMessage({ id: `app.global.${emitterKey}`})}
        </Button>
        <Button
          disabled={!selectedKeys.length}
          onClick={() => eventEmitter.emit('order-archive')}
        >
          { formatMessage({ id: 'app.common.archive', defaultMessage: '归档' })}
        </Button>
      </>
    )
  },
  // 取消成功订单
  askforcancel_cancel_fail: ({ 
    formatMessage,
    eventEmitter, 
    selectedKeys,
    allKeys 
   }) => {
    let emitterKey = selectedKeys.length !== allKeys.length ?  'check-all' : 'uncheck-all'
    return (
      <>
        <Button
          onClick={() => eventEmitter.emit(emitterKey)}
        >
           {formatMessage({ id: `app.global.${emitterKey}`})}
        </Button>
        <Button
          disabled={!selectedKeys.length}
          onClick={() => eventEmitter.emit('order-archive')}
        >
          { formatMessage({ id: 'app.common.archive', defaultMessage: '归档' })}
        </Button>
      </>
    )
  },
  repeat: ({
    formatMessage,
    eventEmitter, 
    selectedKeys,
    allKeys 
  }) => {
    let emitterKey = selectedKeys.length !== allKeys.length ?  'check-all' : 'uncheck-all'
    return (
      <>
        <Button
          onClick={() => eventEmitter.emit(emitterKey)}
        >
          {formatMessage({ id: `app.global.${emitterKey}`})}
        </Button>
        <Button
          disabled={!selectedKeys.length}
          onClick={() => eventEmitter.emit('reset-valid')}
        >
          { formatMessage({ id: 'app.common.resetValid', defaultMessage: '置为有效单' })}
        </Button>
        <Button
          disabled={!selectedKeys.length}
          onClick={() => eventEmitter.emit('reset-invalid')}
        >
          { formatMessage({ id: 'app.common.resetInvalid', defaultMessage: '置为无效单' })}
        </Button>
      </>
    )
  }
}