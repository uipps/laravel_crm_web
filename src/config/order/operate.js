import { Checkbox } from 'antd'
import { useIntl } from 'umi'
export default {
  redelivery: ({ data }) => {
    const { formatMessage } = useIntl();
    return {
      title: formatMessage({ id: 'app.global.select' }),
      width: 80,
      align: 'center',
      render: (row) => {
        return <Checkbox checked={data === row.id} />
      }
    }
  },
  replenish: ({ data }) => {
    const { formatMessage } = useIntl();
    return {
      title: formatMessage({ id: 'app.global.select' }),
      width: 80,
      align: 'center',
      render: (row) => {
        return <Checkbox checked={data === row.id} />
      }
    }
  },
  addcancelorder: ({ data }) => {
    const { formatMessage } = useIntl();
    return {
      title: formatMessage({ id: 'app.global.select' }),
      width: 80,
      align: 'center',
      render: (row) => {
        return <Checkbox checked={data === row.id} />
      }
    }
  }
}