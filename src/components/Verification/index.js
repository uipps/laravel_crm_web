import React, { PureComponent } from 'react';
import { Input, Row, Col, Spin } from 'antd';
import { IconFont } from '@/components';
import './styles.less';
import axios from 'axios';
import { FormattedMessage, useIntl } from 'umi'


/**
 * 统一验证码输入框
 */
export default class Verification extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      random: Date.now(),
      loading: true,
      value: undefined,
      imgUrl: '',
    };
  }
  componentDidMount() {
    this.presentImg();
  } 
  presentImg() {
    const { url } = this.props;
    const params = {
      type: 'login',
      expiresIn: '3600',
    };
    axios.post(url, params).then(data => {
      this.setState({ imgUrl: data.encoded });
    });
  }
  onClick = () => {
    this.setState(
      {
        loading: true,
        //random: Date.now()
      },
      () => {
        this.presentImg();
      },
    );
  };
  onChange = e => {
    const { onChange } = this.props;
    const value = e.target.value;
    this.setState(
      {
        value,
      },
      () => {
        onChange && onChange(value);
      },
    );
  };
  onLoad = () => {
    this.setState({ loading: false });
  };
  getValue = () => {
    return this.state.value;
  };
  onPressEnter = e => {
    const { onPressEnter } = this.props;
    onPressEnter && onPressEnter(e);
  };
  render() {
    const { imgUrl, loading, value } = this.state;
    const { onPressEnter, formatMessage = f => f } = this.props;
    return (
      <Input.Group>
        <Row gutter={24}>
          <Col span={14}>
            <Input
              value={value}
              placeholder={formatMessage({id: 'app.message.pleaseInputCheckCode'})}
              prefix={
                <IconFont type="icon-security" style={{ color: '#9E9E9E' }} />
              }
              onChange={this.onChange}
              onPressEnter={onPressEnter}
            />
          </Col>
          <Col span={10}>
            <Spin spinning={loading}>
              <div className="verification-img" onClick={this.onClick}>
                <img className="img" onLoad={this.onLoad} src={imgUrl} alt="" />
              </div>
            </Spin>
          </Col>
        </Row>
      </Input.Group>
    );
  }
}
