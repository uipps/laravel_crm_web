import { Tabs } from 'antd';
import { useIntl, useParams, history } from 'umi';
import './styles/details.less';
import { pathToRegexp } from '@/utils'

export default function(props) {
  const formatMessage = useIntl().formatMessage;

  const { id } = useParams();
  const { pathname } = history.location;

  let pathType = pathToRegexp('/:module/customer/:id/:type').exec(pathname)

  const module = pathType && pathType[1]

  const routerMap = [
    {
      key: '1',
      path: `/${module}/customer/${id}/info`,
    },
    {
      key: '2',
      path: `/${module}/customer/${id}/order`,
    },
  ];
  const defaultActiveKey = routerMap.find(e => e.path === pathname)?.key ?? '1';

  const handlerTabsChange = key => {
    const path = routerMap.find(e => e.key === key).path;
    history.push(path);
  };

  return (
    <div className="ctd">
      <Tabs
        defaultActiveKey={defaultActiveKey}
        type="card"
        onChange={handlerTabsChange}
      >
        <Tabs.TabPane
          tab={formatMessage({ id: 'app.common.customerInfo' })}
          key="1"
        />
        <Tabs.TabPane
          tab={formatMessage({ id: 'app.common.customerOrder' })}
          key="2"
        />
      </Tabs>

      <div className="ctd__content">{props.children}</div>
    </div>
  );
}
