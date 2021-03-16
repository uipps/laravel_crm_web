import { useState, useEffect } from 'react';
import { useIntl, useRequest, history, useModel } from 'umi';
import services from '@/services';
import { basic, store, Explain } from '@/utils';
import { Button } from 'antd';
import { DataSheet, Filter, Dialog, FieldTreeSelect } from '@/components/index';
import { pathToRegexp } from 'path-to-regexp'

import reportCfg from '@/config/report'
const explain = new Explain(reportCfg)

export default function () {
  const { pathname, query } = history.location;
  const formatMessage = useIntl().formatMessage;
  const { formatDDIC, transferParams } = basic;

  const accountInfo = store.get('account');

  // 头部filter是否显示
  const showHeadFilter = ![2].includes(accountInfo?.level);

  const { language, country } = useModel('common')

  // 取URL参数
  let pathType = pathToRegexp('/:module/report').exec(pathname)
  const module = pathType && pathType[1]

  // 根据地址不同分配不同的columns和filter
  const pageCfg = {
    'pre-sales': 'pre-report',
    'after-sales': 'after-report',
  }

  // 配置列
  const { columns, filter } = explain.setRuleKey(pageCfg[module]).setFormatMessage(formatMessage).generate({ language, country } )

  // 保存select的配置
  const [recordFilter, setRecordFilter] = useState({
    '1': {
      id: 'user_id',
      options: [],
      type: 'select',
      optionsMap: {
        label: 'real_name',
        value: 'id'
      },
      placeholder: formatMessage({id: 'app.common.allStaff'}),
    },
    '2': {
      id: 'department_id',
      options: [],
      component: FieldTreeSelect,
      mapValue: 'id',
      mapName: 'name',
      placeholder: formatMessage({id: 'app.common.allDepartment'}),
    },
  })
  // 保存当前的select
  const [current, setCurrent] = useState(query.search_type || '2')

  const headFilters = [
    {
      id: 'search_type',
      type: 'select',
      options: [
        { value: "2", label: formatMessage({ id: 'app.common.department' }) },
        { value: "1", label: formatMessage({ id: 'app.common.staff' }) },
      ],
      allowClear: false
    },
    recordFilter[current],
    {
      id: 'order_time',
      type: 'datePicker',
    },
  ]

  // filter的默认值
  const [defaultSelectParent, setDefaultSelectParent] = useState()

  // query变的时候才会更新filter
  useEffect(() => {
    setDefaultSelectParent({ search_type: "2", department_id: "0", user_id: "0", ...query })
  }, [query])

  // 请求部门
  const { data: departments, run: getDepartment } = useRequest(services.branchListAble, {
    manual: !showHeadFilter,
    onSuccess: (result) => {
      let res = result?.list || [];
      res.unshift({
        id: "0",
        name: formatMessage({ id: 'app.common.allDepartment' })
      });
      recordFilter['2'].options = res
      setRecordFilter({ ...recordFilter })
    }
  });
  // 请求员工
  const { data: staffList, run: getStaff } = useRequest(services.staffList, {
    manual: !showHeadFilter,
    onSuccess: (result) => {
      let res = result?.list || [];
      res.unshift({
        id: "0",
        real_name: formatMessage({ id: 'app.common.allStaff' })
      });
      recordFilter['1'].options = res
      setRecordFilter({ ...recordFilter })
    },
    defaultParams: [{level: 2}]
  });

  // 请求下载文件
  const downCfg = {
    'pre-sales': services.preSalesReportDownLoad,
    'after-sales': services.afterSalesOrderReportExport
  }

  const { run: download } = useRequest(downCfg[module], { manual: true });

  const showConfirm = () => {
    Dialog.confirm({
      message: formatMessage({ id: 'app.message.exportTotalMsg' }, {total: data?.pagination.total || 0}) ,
      onOk: onExportToFile
    })
  }

  // 根据地址不同分配不同的columns和filter
  const fetchCfg = {
    'pre-sales': services.preSalesReport,
    'after-sales': services.afterSalesOrderReport,
  }
  const { data, loading } = useRequest(
    () => {
      let query = history.location.query;
      return fetchCfg[module](query, {})
    },
    {
      refreshDeps: [query]
    }
  );

  const onExportToFile = e => {
    let field_list = columns.reduce((pre, cur) => {
      if(cur.dataIndex === 'goods_info'){
        pre['customer_name'] = formatMessage({ id: 'app.common.customerName' });
        pre['tel'] = formatMessage({ id: 'app.common.phoneNumber' });
        pre['internal_name'] = formatMessage({ id: 'app.common.goodsName' });
        pre['sku'] = formatMessage({ id: 'app.common.sku' });
        pre['num'] =  formatMessage({ id: 'app.common.number' });
      }else{
        pre[cur.dataIndex] = cur.title;
      }
      return pre;
    }, {});
    // 售前加备注
    if (module === 'after-sales') {
      field_list.sale_remark = formatMessage({id: 'app.common.remark'})
    }

    try {
      download(
        { request_action: 'download', field_list, ...query },
        { responseType: 'blob' },
      );
    } finally {
      Dialog.closeModal()
    }
  };

  // 导出数据为文件按钮
  const exportDataToFileBtn = () => {
    return (
      <Button
        type="primary"
        onClick={showConfirm}
        disabled={!data?.list.length > 0}
      >
        {formatMessage({ id: 'app.global.downLoadTableData' })}
      </Button>
    );
  }

  // Filter 提交
  const onSubmit = values => {
    history.push({
      pathname,
      query: { ...values, current: 1 }
    });

  };
  // 分页拉数据
  const handlerPageChange = (pageAction) => {
    history.push({
      pathname,
      query: { ...query, ...pageAction },
    });
  };

  const selectChange = ({ key, value }) => {
    if(key === "search_type" && value) {
      setCurrent(value)
    }
  };

  const getFormat = (type) => {
    return v => transferParams(v)[type]([
      {
        field: 'distribute_time',
        to: ['distribute_time_start', 'distribute_time_end'],
      },
      {
        field: 'order_time',
        to: ['order_time_start', 'order_time_end'],
      },
      {
        field: 'pre_opt_time',
        to: ['pre_opt_time_start', 'pre_opt_time_end'],
      },
      {
        field: 'audit_time',
        to: ['audit_time_start', 'audit_time_end'],
      },
    ]).fetch()
  }

  return (
    <>
      <Filter
        values={defaultSelectParent}
        onChange={selectChange}
        headFilters={showHeadFilter ? headFilters : []}
        items={filter}
        onSubmit={onSubmit}
        inputHandler={getFormat('reverse')}
        outputHandler={getFormat('tactic')}
        style={{ marginBottom: 16 }}
      />

      <DataSheet
        dataSource={data?.list ?? []}
        columns={columns}
        loading={loading}
        total={data?.list.length ?? 0}
        pagination={data?.pagination ?? {}}
        onChange={handlerPageChange}
        action={exportDataToFileBtn}
      />
    </>
  );
}
