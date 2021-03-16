import { Button } from 'antd'
export default {
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
          {formatMessage({ id: 'app.common.archive'})}
        </Button>
      </>
    )
  },
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
          {formatMessage({ id: 'app.common.archive'})}
        </Button>
      </>
    )
  },
  audit_not_t: ({ 
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
          onClick={() => eventEmitter.emit('order-audit')}
        >
          {formatMessage({ id: 'app.common.auditAction'})}
        </Button>
      </>
    )
  }
}