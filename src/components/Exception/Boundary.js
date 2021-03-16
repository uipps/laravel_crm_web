import React from 'react'
import { Result, Button } from 'antd'
import { FormattedMessage, useIntl } from 'umi' 
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: '',
    };
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error, info) {
    this.setState({
      error,
      info,
    })
    const { onError } = this.props;
    if (onError && typeof onError === 'function') {
      onError(error, info)
    }
  } 
  render() {
    const { hasError, error } = this.state
    const { formatMessage = f => f} = this.props;
    if (hasError) {
      return (
        <Result
          status="error"
          title={formatMessage({id: 'app.message.componentRenderError'})}
        >
          { error.stack }
        </Result>
      )
    }
    return this.props.children
  }
}