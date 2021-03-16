import { Tabs } from 'antd';
import './styles/layout.less';
import { useIntl } from 'umi'
import { pathCompile, pathMatch } from '@/utils';

export default function({ history, match, children, location, ...props }) {
  const {formatMessage} = useIntl();
  const onChange = activeKey => {
    let { path, params } = match;
    params = { ...params, activeKey };
    path = `${path}/:activeKey`;
    path = pathCompile(path)(params);
    history.push(path);
  };
  let { params } = pathMatch('/system/staff/:id/:activeKey')(location.pathname);
  return (
    <div className="staffView">
      <Tabs type="card" onChange={onChange} activeKey={params.activeKey}>
        <Tabs.TabPane tab={formatMessage({id: 'app.common.staffBasicInfo'})} key="basic" />
        <Tabs.TabPane tab={formatMessage({id: 'app.common.linkCustomList'})} key="customer" />
        <Tabs.TabPane tab={formatMessage({id: 'app.common.linkOrderList'})} key="order" />
      </Tabs>
      <div className="staffViewBody">{children}</div>
    </div>
  );
}
