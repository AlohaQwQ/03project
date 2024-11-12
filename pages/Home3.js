import React, { useState } from "react";
import { Layout, Spin } from 'antd';
import MouseParallax from './MouseParallax'; // 导入 MouseParallax 组件
import ParallaxBackground from './ParallaxBackground'; // 导入 立体动态效果组件 组件

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
		<Layout style={{ backgroundColor: '#01050B', margin: 0, padding: 0, overflow: 'hidden', width: '110vw', height: '100vh' }}>
			<Content>
				{/* <MouseParallax onLoadComplete={handleLoadComplete} /> */}
				{/* <div className="overflow-hidden">
					<div id="mouse-parallax-container" style={{ overflow: 'none', position: 'relative', width: '110vw', height: '100vh' }} className="parallax">
						<div className="paraChild" style={{ backgroundImage: 'url(/resources/images/home/1.png)', transform: 'none' }}></div>
						<div className="paraChild" style={{ backgroundImage: 'url(/resources/images/home/2.png)', backgroundPosition: 'center 40%', backgroundSize: '54vh', transform: 'none' }}></div>
						<div className="paraChild" style={{ backgroundImage: 'url(/resources/images/home/3.png)', width: '105%', marginLeft: '-2.5%', height: '108%', top: '-4%', transform: 'none' }}></div>
						<div className="paraChild" style={{ backgroundImage: 'url(/resources/images/home/4.png)', width: '105%', marginLeft: '-2.5%', height: '108%', top: '-4%', transform: 'none' }}></div>
					</div>
				</div> */}
				<ParallaxBackground />
			</Content>
		</Layout>
	);
};

export default Home3;