import { Form, Input } from 'antd';
import styles from './styles.less';
function BizForm({
  fake = ['id'],
  footer,
  footerLayout = { span: 24 },
  footerRight,
  children,
  ...props
}) {
  return (
    <Form {...props} className={styles.container}>
      {fake &&
        fake.map(field => (
          <Form.Item name={field} noStyle key={field}>
            <Input type="hidden" />
          </Form.Item>
        ))}
      <div className={styles.containerBody}>{children}</div>
      {footer && (
        <div className={styles.containerFooter}>
          <Form.Item wrapperCol={footerLayout} className={footerRight && styles.containerFooterRight}>
            {footer}
          </Form.Item>
        </div>
      )}
    </Form>
  );
}
BizForm.useForm = Form.useForm;
BizForm.Item = Form.Item;
BizForm.List = Form.List;
BizForm.Provider = Form.Provider;

BizForm.Partition = props => {
  return <div className={styles.partition}>{props.title}</div>;
};

export default BizForm;
