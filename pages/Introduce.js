import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spin, Layout, Modal, Image } from 'antd';

const { Content } = Layout;

const Introduce = () => {
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
					<Layout style={{ backgroundColor: '#01050B' }}>
						<Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '12%' }}>
							<Image
								preview={false}
								alt="img"
								src="/resources/images/introduce.png"
								className="responsive-image"
								style={{ width: '10000px', height: 'auto', objectFit: 'cover' }}
							/>
						</Content>
					</Layout>
				</>
			) : (
				<Layout style={{ backgroundColor: '#01050B' }}>
					<Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '4%' }}>
						<Image
							preview={false}
							alt="img"
							src="/resources/images/introduce.png"
							className="responsive-image"
							style={{ width: '10000px', height: 'auto', objectFit: 'cover' }}
						/>
					</Content>
				</Layout>
			)
			}
		</>
	);
};

export default Introduce;