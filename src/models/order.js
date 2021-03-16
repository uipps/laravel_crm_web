import { useState } from 'react';
export default () => {
  const [visibleAddress, setVisibleAddress] = useState(false); // 选择客户的弹框的状态
  const [visibleServices, setVisibleServices] = useState(false); //选择客服的弹窗的状态
  const [visibleGoods, setVisibleGoods] = useState(false); // 选择商品的弹出状态
  const [visibleOrder, setVisibleOrder] = useState(false) // 订单列表的一系列弹出
  const [visibleStaff, setVisibleStaff] = useState(false) // 选择员工弹框
  const [selectedRowKeys, setRowKeys] = useState([]); // 多选的表格IDS
  const [selectedRowKey, setRowKey] = useState(null) // 单选的表格ID

  return {
    addressModal: { visible: visibleAddress, setVisible: setVisibleAddress },
    servicesModal: { visible: visibleServices, setVisible: setVisibleServices },
    goodsModal: { visible: visibleGoods, setVisible: setVisibleGoods },
    customerService: { visible: visibleStaff, setVisible: setVisibleStaff },
    orderModal: { 
      visible: visibleOrder, 
      setVisible: setVisibleOrder 
    },
    tableRow: { 
      selectedRowKey,
      setRowKey,
      selectedRowKeys, 
      setRowKeys
    }
  };
};
