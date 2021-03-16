import { useState, useCallback } from 'react';
import { useRequest } from 'umi'
import services from '@/services';

export default () => {
  const { run: runCall } = useRequest(services.makeCall, {
    manual: true
  }); // 拨打电话
  const [customer_name, setName] = useState();
  const [product_name, setProduceName] = useState()
  const [order_no, setId] = useState()
  const [tel, setTel] = useState()
  const [visible, setVisible] = useState(false)
  const makeCall = (args = {}) => {
    setName(args.customer_name)
    setTel(args.tel)
    setId(args.order_no)
    setVisible(true)
  }
  const setCancel = () => {
    setName(null)
    setTel(null)
    setId(null)
    setVisible(false)
  }
  return {
    makeCall,
    visible,
    setCancel,
    runCall,
    data: { customer_name, order_no, tel }
  };
};
