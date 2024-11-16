// Navbar.js
import { Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // 如果你使用的是 Next.js
import dynamic from 'next/dynamic'; // 确保导入 dynamic
import { IntlProvider } from 'react-intl';
import messages from './locales';
import { useIntl } from 'react-intl';
import { Image, Drawer, Button, Layout } from 'antd'; // 导入 Ant Design 的 Button
import { FormattedMessage } from 'react-intl';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const { Content } = Layout; // 确保在这里定义 Content

const items = [
  {
    label: 'Home',
    key: 'home',
    path: '/' // 添加路径
  },
  {
    label: 'Mint',
    key: 'mintnfts',
    path: '/MintNFT' // 添加路径
  },
  {
    label: '03List',
    key: 'nftList',
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
  // const { width, height } = useScreenSize(); // 获取屏幕宽度
  const [visible, setVisible] = useState(false);
  const { connected, disconnect, connect } = useWallet(); // 获取连接状态和方法
  const { setVisible: setModalVisible } = useWalletModal(); // 获取打开钱包选择对话框的方法
  const [walletIcon, setWalletIcon] = useState('/resources/images/wallet2.png'); // 默认图标路径

  const handleClick = () => {
    if (connected) {
      disconnect(); // 如果已连接，则断开连接
    } else {
      setModalVisible(true); // 如果未连接，则连接钱包
    }
  };

  useEffect(() => {
    // 根据连接状态更新钱包图标
    if (connected) {
      setWalletIcon('/resources/images/wallet3.png'); // 已连接状态的图标路径
    } else {
      setWalletIcon('/resources/images/wallet2.png'); // 未连接状态的图标路径
    }
  }, [connected]); // 监听 connected 状态变化


  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

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
    const newLanguage = currentLanguage === 'en' ? 'zh' : 'en'; // 切换语言
    console.log("newLanguage:" + newLanguage)
    setCurrentLanguage(newLanguage);
    switchLanguage(newLanguage); // 调用传入的切换语言函数
  };

  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    // 组件挂载时设置初始尺寸
    handleResize();

    // 添加事件监听器
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* 手机端布局 */}
      {screenSize.width < 768 ? (
        <>
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode={"horizontal"} // 根据屏幕宽度选择模式
            className="custom-menu"
            style={{ width: '100%', justifyContent: 'left', position: 'absolute', top: 0, zIndex: '999' }} // 设置菜单宽度和对齐方式
          >
            {items.map(item => (
              <Menu.Item key={item.key}>
                {item.path ? (
                  <Link href={item.path}><FormattedMessage id={item.key} /></Link>
                ) : (
                  <span><FormattedMessage id={item.key} /></span>
                )}
              </Menu.Item>
            ))}
            <div className='header-operations'>
              <Menu.Item key="language-toggle">
                <Image
                  src="/resources/images/switch.png" // 根据当前语言选择图片  style={{ marginLeft: '800px' }}
                  alt={'lang'}
                  preview={false}
                  style={{ cursor: 'pointer', width: '20px', height: '20px' }} // 设置图片样式
                  onClick={handleLanguageToggle} // 点击切换语言
                />
              </Menu.Item>

              <Menu.Item key="wallet-button"> {/* 添加样式使按钮右对齐  style={{ marginLeft: 'auto' }} */}
                <Image
                  src={walletIcon} // 替换为你的钱包图标路径
                  alt="Wallet"
                  preview={false}
                  style={{ cursor: 'pointer', width: '30px', height: '30px' }} // 设置图片样式
                  onClick={handleClick} // 点击事件处理
                />
              </Menu.Item>
            </div>
          </Menu>
        </>
      ) : (
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode={"horizontal"} // 根据屏幕宽度选择模式
          className="custom-menu"
          style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'absolute', top: 0, zIndex: '999' }} // 设置菜单宽度和对齐方式
        >
          <div className='menu-wrap'>
            {items.map(item => (
              <Menu.Item key={item.key} style={{ flex: '0 10 200px', textAlign: 'center' }}> {/* 设置每个菜单项占满宽度并居中 */}
                {item.path ? (
                  <Link href={item.path}><FormattedMessage id={item.key} /></Link>
                ) : (
                  <span><FormattedMessage id={item.key} /></span>
                )}
              </Menu.Item>
            ))}
          </div>
          <div className='header-operations'>
            <Menu.Item className="ant-menu-item" key="language-toggle">
              <Image
                src="/resources/images/switch.png" // 根据当前语言选择图片  style={{ marginLeft: '800px' }}
                alt={'lang'}
                preview={false}
                style={{ cursor: 'pointer', width: '30px', height: '30px' }} // 设置图片样式
                onClick={handleLanguageToggle} // 点击切换语言
              />
            </Menu.Item>

            <Menu.Item key="wallet-button" > {/* 添加样式使按钮右对齐  style={{ marginLeft: 'auto' }} */}
              <ButtonWrapper
                showAddress={false}
                className="wallet-button" /> {/* 将 ButtonWrapper 添加到菜单中 */}
            </Menu.Item>
          </div>
        </Menu>
      )
      }
    </>
  );
};

export default Navbar;