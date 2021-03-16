import { useState } from 'react';
export default () => {
  const [visibleCustomer, setVisibleCustomer] = useState(false); // 选择客户的弹框的业务性组件
  const [visibleGoods, setVisibleGoods] = useState(false) // 选择商品的弹框业务性组件可见状态
  const [visibleOrder, setVisibleOrder] = useState(false) // 选择原订单弹框业务组件的可见状态
  const [visibleService, setVisibleService] = useState(false) // 选择客服的弹框业务组件
  const [visibleClue, setVisibleClue] = useState(false) // 选择线索的弹框业务组件
  const [visibleLogistics, setVisibleLogistics] = useState(false) // 物流信息轨迹展示弹框
  return {
    _selectCustomer: { visible: visibleCustomer, setVisible: setVisibleCustomer },
    _selectGoods: { visible: visibleGoods, setVisible: setVisibleGoods },
    _selectOrder: { visible: visibleOrder, setVisible: setVisibleOrder },
    _selectService: { visible: visibleService, setVisible: setVisibleService },
    _selectClue: { visible: visibleClue, setVisible: setVisibleClue },
    _logistics: { visible: visibleLogistics, setVisible: setVisibleLogistics }
  };
};
