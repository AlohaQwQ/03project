import React from "react";
import { Card, Row, Col, Spin, Layout, Modal, Image } from 'antd';

const { Content } = Layout;

const Introduce = () => {
	return (
		<Layout style={{ backgroundColor: '#01050B' }}>
			<Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<Image
					preview={false}
					alt="img"
					src="/resources/images/introduce.png"
					className="responsive-image"
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>
			</Content>
		</Layout>
	);
};

export default Introduce;