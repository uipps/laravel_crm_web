import { Dropdown, Button, Menu } from 'antd';

export default function SelectAction({ children, actions = [] }) {
  const onItemClick = ({ onClick, ...item }, e) => {
    onClick && onClick(item);
  };
  const overlay = (
    <Menu>
      {actions.map((item, idx) => (
        <Menu.Item key={item.key || idx} onClick={e => onItemClick(item, e)}>
          {item.title}
        </Menu.Item>
      ))}
    </Menu>
  );
  return <Dropdown overlay={overlay}>{children}</Dropdown>;
}
