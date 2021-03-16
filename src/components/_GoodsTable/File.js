import { useState, useEffect } from 'react'
import { useIntl, useRequest } from 'umi'
import {  Button, Upload, Modal } from 'antd'
import { UploadOutlined, CloseOutlined, LinkOutlined } from '@ant-design/icons'
import Picture from '../Picture'
import styles from './styles.less'

export default function ({
  disabled,
  value,
  onChange
}) {
 
  const { formatMessage } = useIntl()
  const [file, setFile] = useState(value); // 传入的文件状态
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)
  useEffect(() => {
    setFile(value)
  }, [value])
  // 文件改变时
  const onFileChange = ({ file }) => {
    const { status, response } = file
    if (status === 'uploading') {
      setLoading(true)
    }
    if (status === 'done' && response) {
      let { data } = response
      setFile(data.ObjectURL)
      onChange && onChange(data.ObjectURL)
      setLoading(false)
    }
  };
  if (file) {
    return (
    <div className={styles.actionFile}>
      <LinkOutlined onClick={() => setPreview(true)}/>
      <span onClick={() => setPreview(true)}>{file}</span>
      {
        !disabled && <CloseOutlined onClick={() => setFile(null)} />
      }
      <Modal visible={preview} footer={false} onCancel={() => setPreview(false)}>
        <Picture src={file} mode="aspectFit" width={460} height={360} />
      </Modal>
    </div>
    )
  }
  return !disabled && (
    <Upload
      action="/api/v1/uploadpic"
      onChange={onFileChange}
      showUploadList={false}
    >
      <Button loading={loading}>
        <UploadOutlined />
        {formatMessage({ id: 'app.common.uploadScreenshot', defaultMessage: '请上传收款截图' })}
      </Button>
    </Upload>
  )
}