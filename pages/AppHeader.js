// src/components/AppHeader.js
import Link from 'next/link';
import { Menu } from 'antd';

const AppHeader = () => {
    return (
        <header >
            <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
                <Menu.Item key="1">
                    <Link href="/">首页</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link href="/nft-list">NFT 列表</Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link href="/mint">铸造 NFT</Link>
                </Menu.Item>
                <Menu.Item key="4">
                    <Link href="/about">关于我们</Link>
                </Menu.Item>
            </Menu>
        </header >
    );
};

export default AppHeader;