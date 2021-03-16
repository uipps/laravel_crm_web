import styles from './style.less';
import { history, useIntl } from 'umi';
import React from 'react';
import { memo, useState, useEffect, createRef } from 'react';
import { Table, Pagination, Button, Select, Tabs } from 'antd';

export default function DataSheet({
  columns,
  dataSource = [],
  pagination,
  rowKey = 'id',
  extra,
  loading,
  onChange,
  action,
  style,
  scroll,

  headerStyle,
  ...props
}) {
  const containerRef = createRef(); // 容器Ref
  const headRef = createRef(); // 头部Ref
  const footRef = createRef(); // 底部Ref
  const tableRef = createRef();
  const [_scroll, setScroll] = useState({ x: 0, y: 0 });
  const [height, setHeight] = useState()
  const { formatMessage } = useIntl(); // 语言包国际化方案函数
  /*   const {run: runResize} = useThrottleFn(() => {
      computeY();
    }, 200); */
  useEffect(() => {
    if (scroll) {
      setScroll(scroll)
    } else {
      computeY()
    }
    /*     window.addEventListener('resize', runResize);
        return () => window.removeEventListener('resize', runResize); */
  }, [columns]);
  //计算可见高度设置表格
  function computeY() {
    let containerElement = containerRef.current;
    let headElement = headRef.current;
    let footElement = footRef.current;
    if (containerElement) {
      let containerSize = containerElement.getBoundingClientRect();
      let headSize = headElement.getBoundingClientRect();
      let footSize = footElement.getBoundingClientRect();
      let tableSize = document.querySelector('.ant-table-tbody').getBoundingClientRect();
      let theadSize = document.querySelector('.ant-table-thead').getBoundingClientRect()
      let height = containerSize.height - headSize.height - footSize.height
      let areaHeight = height - 32 - window.scrollbarWidth;
      setHeight(height)
      let scroll = {};
      if (tableSize.height > areaHeight) {
        scroll.y = areaHeight;
      }
      if (tableSize.width > containerSize.width) {
        scroll.x = containerSize.width;
      }
      setScroll(scroll);
    }
  }

  // page组件改变时触发
  function onPaginationChang(page, pageSize) {
    onChange && onChange({ page, limit: pageSize });
  }
  // 传入的extra 事件 触发
  function onExtraClick(e, { to, onClick }) {
    if (onClick && typeof onClick === 'function') {
      return onClick();
    }
    if (to && typeof to !== 'function') {
      return history.push(to);
    }
    return;
  }

  return (
    <div className={styles.sheet} ref={containerRef} style={style}>
      <div className={styles.sheetHeader} ref={headRef} style={headerStyle}>
        {Array.isArray(extra) &&
        extra.length > 0 && extra.map(({ to, onClick, title, ...restProps }, idx) =>
          <Button
            className={styles.sheetButton}
            key={idx}
            {...restProps}
            onClick={e => onExtraClick(e, { to, onClick })}
          >
            {title}
          </Button>
        )}
        {React.isValidElement(extra) && extra}
      </div>
      <div className={styles.sheetTable} style={{ height }}>
        <Table
          {...props}
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={false}
          rowKey={rowKey}
          bordered={false}
          footer={false}
          scroll={_scroll}
        />
      </div>
      <div className={styles.sheetFooter} ref={footRef}>
        <div className={styles.sheetAction}>
          {action && typeof action === 'function' ? action(dataSource) : action}
        </div>
        {pagination &&
          <Pagination
            {...pagination}
            showSizeChanger={false}
            showQuickJumper={false}
            onChange={onPaginationChang}
            pageSize={pagination.pageSize ? String(pagination.pageSize) : '20'}
            showTotal={total =>
              <>
                {formatMessage({ id: 'app.message.paginationItemTotal' }, { total })}
                <Select
                  style={{ minWidth: 86 }}
                  value={
                    pagination.pageSize ? String(pagination.pageSize) : '20'
                  }
                  onChange={pageSize =>
                    onPaginationChang(1, pageSize)
                  }
                >
                  <Select.Option value="10">{formatMessage({ id: 'app.message.paginationItem' }, { num: 10 })}</Select.Option>
                  <Select.Option value="20">{formatMessage({ id: 'app.message.paginationItem' }, { num: 20 })}</Select.Option>
                  <Select.Option value="50">{formatMessage({ id: 'app.message.paginationItem' }, { num: 50 })}</Select.Option>
                  <Select.Option value="100">{formatMessage({ id: 'app.message.paginationItem' }, { num: 100 })}</Select.Option>
                </Select>
              </>
            }
          />
        }
      </div>
    </div>
  );
}
