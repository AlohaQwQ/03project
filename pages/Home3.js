import React, { useState } from "react";
import { Layout, Spin } from 'antd';
import MouseParallax from './MouseParallax'; // 导入 MouseParallax 组件

const { Content } = Layout;

const Home3 = () => {
	const [loading, setLoading] = useState(true); // 初始化加载状态为 true

	const handleLoadComplete = () => {
		setLoading(false); // 加载完成，设置状态为 false
	};

	// {loading ? ( // 根据加载状态显示加载框
	// 	<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
	// 		<Spin size="large" /> {/* 显示加载框 */}
	// 	</div>
	// ) : (
	// 	<MouseParallax onLoadComplete={handleLoadComplete} /> // 加载完成后显示 MouseParallax 组件
	// )}

	return (
		<Layout style={{ backgroundColor: '#01050B', margin: 0, padding: 0 }}>
			<Content>


				<MouseParallax onLoadComplete={handleLoadComplete} />
			</Content>
		</Layout>
	);
};

export default Home3;