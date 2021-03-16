import { Form, Row, Col, Button, Table, Input, message } from 'antd';
import { useIntl, useRequest, useParams, useModel, history } from 'umi';
import { useState } from 'react';
import './styles/details.less';
import services from '@/services';
import _Tags from '../../components/_Tags';
import { TimeAxis, IconFont } from '@/components';
import { basic, _ } from '@/utils'

export default function() {
  const formatMessage = useIntl().formatMessage;

  const matchParams = useParams();

  let baseInfo = [
    { label: 'app.common.fullName', dataIndex: 'customer_name' },
    { label: 'app.common.phone', dataIndex: 'tel', render: v => basic.getSecretTelNum(v) },
    { label: 'app.common.countryRegions', dataIndex: 'country_name' },
    { label: 'app.common.language', dataIndex: 'language_name' },
    { label: 'app.common.faceBookId', dataIndex: 'facebook_id' },
    { label: 'app.common.whatAppId', dataIndex: 'whatsapp_id' },
    { label: 'app.common.lineId', dataIndex: 'line_id' },
    {},
    { label: 'app.common.preSaleService', dataIndex: 'pre_sale_name' },
    { label: 'app.common.afterSaleService', dataIndex: 'after_sale_name' },
  ];

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const columns = [
    {
      dataIndex: 'customer_name',
      key: 'customer_name',
      render(text) {
        return (
          <div key={text}>
            <span className="table-label">
              {formatMessage({ id: 'app.common.fullName' })}：
            </span>
            <span>{text}</span>
          </div>
        );
      },
    },
    {
      dataIndex: 'zip_code',
      key: 'zip_code',
      render(text) {
        return (
          <div key={text}>
            <span className="table-label">
              {formatMessage({ id: 'app.common.zipCode' })}：
            </span>
            <span>{text}</span>
          </div>
        );
      },
    },
    {
      dataIndex: 'address',
      key: 'address',
      render(text) {
        return (
          <div key={text}>
            <span className="table-label">
              {formatMessage({ id: 'app.common.detailedAddress' })}：
            </span>
            <span>{text}</span>
          </div>
        );
      },
    },
  ];

  const { account } = useModel('@@initialState').initialState

  // 请求客户基本信息
  const { data: infoData={} } = useRequest(() => {
    return services.pre.customerDetails(matchParams);
  }, {});

  // 请求收货地址
  const { data: addressList, run: runMoreAddress, loading:addressLoading } = useRequest(services.pre.customerAddressId, { defaultParams: [{state: ' ', ...matchParams}] });

  // 请求客户备注
  const { data: remarkData, run: runRemarkList } = useRequest(() => {
    return services.pre.customerRemarkList({ customer_id: matchParams.id });
  });

  // 请求添加备注
  const { run: runAddRemark, loading: addRemarkLoading } = useRequest(services.pre.customerRemarkAdd, {
    manual: true,
    onSuccess() {
      setAddRemarkValue('');
      runRemarkList().then();
      // 添加成功通知
      message.success(formatMessage({ id: 'app.message.add.success' }));
    }
  });

  // 请求修改备注
  const { run: runEditRemark } = useRequest(services.pre.customerRemarkEdit, {
    manual: true,
    onSuccess() {
      setEditId(null);
      runRemarkList().then();
      // 修改成功通知
      message.success(formatMessage({ id: 'app.message.edit.success' }));
    }
  });

  // 全局控制时间轴编辑状态
  const [editRemarks, setEditRemarks] = useState(false);

  // 记录textarea的值
  const [addRemarkValue, setAddRemarkValue] = useState('');

  // 改变备注
  const onChangeRemarks = item => {
    runEditRemark({ id: item.id, remark: item.newVal }).then();
  };

  // 添加备注
  const addRemarks = () => {
    // 提交前判断
    if(addRemarkValue === '') {
      message.warn(formatMessage({ id: 'app.message.inputRemark' }));
      return false
    }
    // 提交
    const params = {
      customer_id: matchParams.id,
      remark: addRemarkValue,
    };
    runAddRemark({ ...params }).then();
  };

  // 显示全部地址
  const onMoreAddress = () => {
    runMoreAddress({state: 'all', ...matchParams}).then(() => {
      setMoreAddress(false)
    })
  }

  // 当前编辑的备注id
  const [editId, setEditId] = useState(null);

  // 是否显示全部的地址
  const [moreAddress, setMoreAddress] = useState(true)

  // 时间轴，右边备注的渲染函数
  const renderRemarks = item => {
    return (
      <div className="remarks" key={item.id}>
        <div>
          {basic.formatDDIC(`sys_department.job_type.${item.job_type}`)}：{item.sale_name}
        </div>
        {editId !== item.id && (
          <div>
            {formatMessage({ id: 'app.common.remark' })}：{item.remark}
          </div>
        )}
        {editRemarks && editId !== item.id && item.creator_id === account.id && (
          <Button
            type="primary"
            ghost={true}
            style={{ marginTop: 3 }}
            onClick={() => {
              setEditId(item.id);
            }}
          >
            {formatMessage({ id: 'app.global.modify' })}
          </Button>
        )}
        {editId === item.id && (
          <div className="remarks__edit">
            <div className="remarks__edit--label">
              {formatMessage({ id: 'app.common.remark' })}：
            </div>
            <div>
              <Input.TextArea
                rows={3}
                defaultValue={item.remark}
                onChange={({ currentTarget }) => {
                  item.newVal = currentTarget.value;
                }}
              />

              <div className="remarks__edit--btn">
                <Button
                  type="primary"
                  onClick={() => {
                    onChangeRemarks(item);
                  }}
                >
                  {formatMessage({ id: 'app.global.save' })}
                </Button>
                <Button
                  onClick={() => {
                    setEditId(null);
                  }}
                >
                  {formatMessage({ id: 'app.global.cancel' })}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="c-info">
      <Form {...layout}>
        <Row>
          {baseInfo.map((item, index) => (
            <Col span={12} key={index}>
              {item.dataIndex &&
                <Form.Item label={formatMessage({ id: item.label })}>
                  {item.render ? item.render(infoData[item.dataIndex]) : (infoData[item.dataIndex] || '-')}
                </Form.Item>
              }
            </Col>
          ))}
        </Row>
      </Form>

      <div className="c-info__tb">
        <_Tags />
      </div>

      <div className="c-info__project">
        <div className="c-info__project--title">
          {formatMessage({ id: 'app.common.shippingAddress' })}
        </div>

        <Table
          showHeader={false}
          columns={columns}
          dataSource={addressList?.list ?? []}
          pagination={false}
          loading={addressLoading}
          rowKey="id"
        />

        {moreAddress && (addressList?.list?.length < addressList?.pagination?.total ) && (
          <div className="more" onClick={onMoreAddress}>
            {formatMessage({ id: 'app.common.viewAll' })}
          </div>
        )}
      </div>

      <div className="c-info__project">
        <div className="c-info__project--title">
          <span>{formatMessage({ id: 'app.common.remark' })}</span>
          <span
            className="c-info__project--edit"
            onClick={() => {
              setEditRemarks(!editRemarks);
            }}
          >
            <IconFont type="icon-edit-square" />
            {!editRemarks
              ? formatMessage({ id: 'app.common.managerRemark' })
              : formatMessage({ id: 'app.global.cancel' })}
          </span>
        </div>

        {/* 添加备注 */}
        {editRemarks && (
          <div className="add-remarks">
            <Input.TextArea
              rows={3}
              value={addRemarkValue}
              placeholder={formatMessage({id: 'app.common.placeholder.remark'})}
              onChange={({ currentTarget }) => {
                setAddRemarkValue(currentTarget.value);
              }}
            />
            <div>
              <Button type="primary" onClick={_.throttle(addRemarks, 2000, { pending: true, trailing: false })} loading={addRemarkLoading}>
                {formatMessage({ id: 'app.common.addRemark' })}
              </Button>
            </div>
          </div>
        )}

        <TimeAxis
          dataSource={remarkData?.list ?? []}
          wrapper={renderRemarks}
        />
      </div>
    </div>
  );
}
