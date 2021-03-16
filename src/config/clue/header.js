import { Button } from 'antd';
import { history } from 'umi'

export default {
  default: ({ formatMessage, eventEmitter }) => { 
    return (<Button type='primary' onClick={() => { history.push(`/after-sales/customer/origin-clue/add`) }}>{formatMessage({id: 'app.common.addClue'})}</Button>)
  },
};


