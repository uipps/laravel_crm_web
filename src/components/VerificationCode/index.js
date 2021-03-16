import './style.less'
import { useState, useEffect } from 'react'

import { useRequest } from 'umi'
import { Input, Row, Col, Spin } from 'antd'

import services from '@/services'
export default function ({
  addonBefore,
  size,
  onChange,
  value
}) {
  let [timestamp, setTimestamp] = useState(Date.now().toString(32))
  let { data, run, loading } = useRequest(services.queryCode, { manual: true })
  useEffect(() => { run({timestamp}) }, [timestamp])
  // 切换图片
  function onClick() {
    setTimestamp(Date.now().toString(32))
  }
  const onInputChange = (e) => {
    onChange && onChange({
      key: data?.key,
      value: e.target.value
    })
  }
  return (
    <Input.Group size={size}>
      <Row gutter={8}>
        <Col span={14}>
          <Input addonBefore={addonBefore} onChange={onInputChange} value={value?.value}/>
        </Col>
        <Col span={10}>
          <Spin spinning={loading}>
            <div className="verification-image" onClick={onClick}>
              <img src={data?.encoded}/>
            </div>
          </Spin>

        </Col>
      </Row>
    </Input.Group>
  )
}