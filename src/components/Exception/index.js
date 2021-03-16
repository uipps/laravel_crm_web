import WithBoundary from './Boundary'
import { IconFont } from '..'
import { Button } from 'antd'
import styles from './styles.less'
import { FormattedMessage, useIntl } from 'umi'


const Exception403 = () => {
  const { formatMessage } = useIntl(); // 语言包国际化方案函数
  return (
    <div className={styles.exception403}>
      <div>
        <IconFont type="icon-quanxianguanli" />
      </div>
      <span>
        {formatMessage({id: 'app.message.noOperationAuthority'})}
      </span>
    </div>
  )
}

const Exception404 = () => {
  const { formatMessage } = useIntl(); // 语言包国际化方案函数
  return (
    <div className={styles.exception404}>
      <div className={styles.exception404Img}/>
      <h2>{formatMessage({id: 'app.message.pageNotFind'})}</h2>
      <span>{formatMessage({id: 'app.message.sorryPageGone'})}</span>
      <Button href="/pre-sales">{formatMessage({id: 'app.message.goHomePage'})}</Button>
    </div>
  )
}

const WithException = props => {
  const { children, currentPathConfig } = props;
  
  if (!currentPathConfig) {
    return <Exception404 />;
  }
  if (currentPathConfig.unAccessible) {
    return <Exception403 />;
  }
  return children;
};
export default {
  WithBoundary,
  WithException
}