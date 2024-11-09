// Navbar.js
import { Menu } from 'antd';
import React, { useState } from 'react';
import Link from 'next/link'; // 如果你使用的是 Next.js
import dynamic from 'next/dynamic'; // 确保导入 dynamic
import { IntlProvider } from 'react-intl';
import messages from './locales';
import { useIntl } from 'react-intl';
import Button from 'antd/es/button'; // 导入 Ant Design 的 Button

const items = [
  {
    label: 'Home',
    key: 'home',
    path: '/' // 添加路径
  },
  {
    label: 'Mint',
    key: 'mintnfts',
    path: '/MintNFTs' // 添加路径
  },
  {
    label: '03List',
    key: 'nftlist',
    path: '/NftList' // 添加路径
  },
  {
    label: 'Project',
    key: 'introduce',
    path: '/Introduce' // 添加路径
  }
];

const Navbar = ({ switchLanguage }) => {
  const [current, setCurrent] = useState('home');
  const onClick = (e) => {
    //console.log('click ', e);
    setCurrent(e.key);
  };

  const ButtonWrapper = dynamic(() =>
    import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton)
  );
  const intl = useIntl();
  const [currentLanguage, setCurrentLanguage] = useState('zh'); // 默认语言

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === 'zh' ? 'zh' : 'en'; // 切换语言
    setCurrentLanguage(newLanguage);
    switchLanguage(newLanguage); // 调用传入的切换语言函数
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      className="custom-menu"
      style={{ width: '100%', display: 'flex', justifyContent: 'center' }} // 设置菜单宽度和对齐方式
    >
      {items.map(item => (
        <Menu.Item key={item.key} style={{ flex: '0 10 200px', textAlign: 'center' }}> {/* 设置每个菜单项占满宽度并居中 */}
          {item.path ? (
            <Link href={item.path}>{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
        </Menu.Item>
      ))}
      <Menu.Item key="language-toggle" style={{ marginLeft: 'auto' }}>
        <Button onClick={handleLanguageToggle}>
          {currentLanguage === 'zh' ? '中文' : 'English'} {/* 根据当前语言显示按钮文本 */}
        </Button>
      </Menu.Item>

      <Menu.Item key="wallet-button" style={{ marginLeft: 'auto' }}> {/* 添加样式使按钮右对齐 */}
        <ButtonWrapper className="wallet-button" /> {/* 将 ButtonWrapper 添加到菜单中 */}
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;