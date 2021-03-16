import styles from './styles.less'
import { numeral } from '@/utils';
export default function ({ title, value, symbol, prefix = '' }) {
  let _value = Number(value)
  return (
    <div className={styles.descItem}>
      <span className={styles.descName}>
        {title}
      </span>
      <span className={styles.descValue}>
        {_value ? symbol : null} {prefix}{numeral(parseInt(_value)).format('0,0.00')}
      </span>
    </div>
  )
}