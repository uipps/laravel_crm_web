import { Button } from 'antd';

export default {
  distribute_not: ({
   formatMessage,
   eventEmitter,
   selectedKeys=[],
   allKeys=[],
 }) => {
    let emitterKey = selectedKeys.length !== allKeys.length ? 'check-all' : 'uncheck-all';

    return (
      <>
        <Button
          onClick={() => eventEmitter.emit(emitterKey)}
        >
          {formatMessage({ id: `app.global.${emitterKey}` })}
        </Button>
        <Button
          disabled={!selectedKeys.length}
          onClick={() => eventEmitter.emit('distribution')}
        >
          {formatMessage({id: 'app.common.assignedTo'})}
        </Button>
      </>
    );
  },
};
