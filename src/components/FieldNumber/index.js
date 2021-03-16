import { PureComponent, useEffect, useState } from 'react'
import { Input, Row, Col } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import style from './style.less'
export default class FieldNumber extends PureComponent {
  static defaultProps = {
    step: 1
  }
  constructor(props) {
    super(props)
    this.state = {
      value: props.value || props.defaultValue
    }
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({ value: nextProps.value })
    }
  }
  onReduce = e => {
    e.preventDefault()
    e.stopPropagation()
    const { min, step } = this.props
    let value = isNaN(Number(this.state.value)) ? 0 : Number(this.state.value)
    value = value - step
    this.setState({
      value: (min !== null || min !== undefined) && value < Number(min) ? min : value
    }, this.onChange)
  }
  onIncrease = e => {
    e.preventDefault()
    e.stopPropagation()
    const { max, step } = this.props
    let value = isNaN(Number(this.state.value)) ? 0 : Number(this.state.value)
    value = value + step
    this.setState({
      value: (max !== null || max !== undefined) && value > Number(max) ? Number(max) : value
    }, this.onChange)
  }
  onInputChange = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let value = Number(e.target.value);
    value = isNaN(value) ? 0 : value;

    this.setState({ value }, this.onChange)

  }
  onChange = () => {
    this.props.onChange && this.props.onChange(this.state.value)
  }
  render() {
    return (
      <Input
        className={style.number}
        value={this.state.value}
        onChange={this.onInputChange}
        addonBefore={<MinusOutlined onClick={this.onReduce} />}
        addonAfter={<PlusOutlined onClick={this.onIncrease} />}
      />
    )
  }
}
