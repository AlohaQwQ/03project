import React, { useState, useEffect } from "react";
import axios from "axios";
import { signAndConfirmTransactionFe } from "./utilityfunc";
// import disPic from './resources/images/upload-file.jpg';
import { Button, Card, Row, Col, Spin, Layout, Modal, Image } from 'antd'; // 确保 Layout 在这里导入
//import AppHeader from './AppHeader'; // 导入 AppHeader 组件
import { FormattedMessage } from 'react-intl';

const xApiKey = "GZdHhsJYG2Wa94Am"; //Enter Your x-api-key here
const { Meta } = Card;
const { Content } = Layout; // 确保在这里定义 Content

const NftList = () => {
	const [file, setfile] = useState();
	// const [displayPic, setDisplayPic] = useState(disPic);
	const [network, setnetwork] = useState("mainnet-beta");
	const [publicKey, setPublicKey] = useState('9d7Cj7v6sTWDJPYjfuHRwwZkNyj9Ydc4JoLjCx9kbM3n');
	const [collectionAddress, setCollectionAddress] = useState('5ZXCtgPopb3vjPjQ4XQPWyS8WjDiZvTkTDPKE8q9pKe1');
	const [page, setPage] = useState(1);
	const [name, setName] = useState();
	const [symbol, setSymbol] = useState();
	const [desc, setDesc] = useState();
	const [attr, setAttr] = useState(JSON.stringify([{ "trait_type": "edification", "value": "100" }]));
	const [extUrl, setExtUrl] = useState();
	const [maxSup, setMaxSup] = useState(100);
	const [roy, setRoy] = useState(99);
	const [minted, setMinted] = useState();
	const [saveMinted, setSaveMinted] = useState();
	const [errorRoy, setErrorRoy] = useState();
	//const [status, setStatus] = useState("Awaiting Upload");
	const [dispResponse, setDispResp] = useState("");
	const [connStatus, setConnStatus] = useState(true);
	const [zeroNfts, setZeroNfts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("Loading...");
	const [walletId, setWalletId] = useState(null);
	const [hasAccess, setAccess] = useState(false);
	const [msg, setMsg] = useState("");
	const [walletAddress, setWalletAddress] = useState('');
	const [showDropdown, setShowDropdown] = useState(false);
	const [selectedNft, setSelectedNft] = useState(null); // 用于存储选中的 NFT
	const [isModalVisible, setIsModalVisible] = useState(false); // 控制模态框的可见性
	const [hasMoreData, setMoreData] = useState(true);

	const callback = (signature, result) => {
		console.log("Signature ", signature);
		console.log("result ", result);
		if (signature.err === null) {
			setMinted(saveMinted);
			setStatus("success: Successfully Signed and Minted.");
		}
	}

	useEffect(() => {
		fetchNftList(); // 在组件加载时调用 fetchNftList
	}, [zeroNfts]); // 空依赖数组确保只在首次渲染时调用

	const fetchNftList = async () => {
		setLoading(true);
		setStatus("Loading");

		const xAPIKey = 'GZdHhsJYG2Wa94Am'; //Your X-API-KEY here
		const collection_address = collectionAddress;

		let reqUrl = `https://api.shyft.to/sol/v1/collections/get_nfts?network=${network}&page=${page}&size=50&collection_address=${collection_address}`;
		axios({
			url: reqUrl,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": xAPIKey,
			},
		})
			.then((res) => {
				console.log(res.data);
				if (res.data.success === true) {
					// 处理成功的响应
					const result = res.data.result; // 获取 result 对象
					if (result && Array.isArray(result.nfts)) {
						const nfts = result.nfts; // 获取 nfts 数组
						if (nfts || nfts.length > 0) {
							let filteredNfts = nfts.filter(nft => nft.name !== 'LingSan03'); // 过滤掉 name 为 LingSan03 的 NFT
							console.log('length:' + filteredNfts.length)
							if (zeroNfts.length > 0) {
								// 创建一个集合来存储 zeroNfts 中的名称
								const existingNames = new Set(zeroNfts.map(existingNft => existingNft.name));

								// console.log('Existing NFT Names:', Array.from(existingNames)); // 打印现有 NFT 名称
								// 去重 filteredNfts，确保只保留不在 zeroNfts 中的 NFT
								filteredNfts = filteredNfts.filter(nft => !existingNames.has(nft.name));
							}

							console.log('filteredNfts:' + filteredNfts.length)
							if (filteredNfts.length > 0) {
								setZeroNfts(prevNfts => [...prevNfts, ...filteredNfts]); // 将新数据添加到现有数组中
								setPage(prevPage => prevPage + 1); // 增加页码
							} else {
								setMoreData(false);
							}
						} else {
							setMoreData(false);
						}

						// nfts.forEach((nft) => {
						// 	if (nft) { // 检查 nft 是否存在
						// 		console.log(`Name: ${nft.name}`);
						// 		console.log(`Symbol: ${nft.symbol}`);
						// 		console.log(`Description: ${nft.description}`);
						// 		console.log(`Image URI: ${nft.image_uri}`);
						// 		// 这里可以根据需要处理其他属性
						// 	}
						// });

					} else {
						console.log("nfts 数组为空或不存在");
						setMoreData(false);
					}
				} else {
					setName('Failed to Load Data');
				}
			})
			.catch((err) => {
				console.warn(err);
				setName('Failed to Load Data');
			})
			.finally(() => {
				setLoading(false);
			});
	}

	const handleImageClick = (nft) => {
		setSelectedNft(nft); // 设置选中的 NFT
		setIsModalVisible(true); // 显示模态框
	};

	const handleModalClose = () => {
		setIsModalVisible(false); // 关闭模态框
		setSelectedNft(null); // 清空选中的 NFT
	};

	const mintNow = (e) => {
		e.preventDefault();
		setStatus("Loading");
		let formData = new FormData();
		formData.append("network", network);
		formData.append("wallet", publicKey);
		formData.append("name", name);
		formData.append("symbol", symbol);
		formData.append("description", desc);
		formData.append("attributes", JSON.stringify(attr));
		formData.append("external_url", extUrl);
		formData.append("max_supply", maxSup);
		formData.append("royalty", roy);
		formData.append("file", file);

		axios({
			url: "https://api.shyft.to/sol/v1/nft/create_detach",
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
				"x-api-key": xApiKey,
				Accept: "*/*",
				"Access-Control-Allow-Origin": "*",
			},
			data: formData,
		})
			.then(async (res) => {
				console.log(res);
				if (res.data.success === true) {
					setStatus("success: Transaction Created. Signing Transactions. Please Wait.");
					const transaction = res.data.result.encoded_transaction;
					setSaveMinted(res.data.result.mint);
					const ret_result = await signAndConfirmTransactionFe(network, transaction, callback);
					console.log(ret_result);
					setDispResp(res.data);
				}
			})
			.catch((err) => {
				console.warn(err);
				setStatus("success: false");
			});
	}

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
					<Layout style={{ background: 'rgba(255, 255, 255, 0)' }}>
						<Image
							alt="img"
							src="/resources/images/mintback.png" // 背景图路径
							preview={false} // 禁用预览
							style={{
								position: 'fixed', // 使用 fixed 使其相对于视口固定
								top: 0,
								left: 0,
								width: '100vw', // 设置宽度为视口宽度
								height: '100vh', // 设置高度为视口高度
								objectFit: 'cover', // 确保图片覆盖整个区域
								zIndex: -1 // 确保背景图在其他内容后面
							}}
						/>
						<Content style={{ background: 'rgba(255, 255, 255, 0)', marginTop: '18%', }}>
							<h2 style={{ textAlign: 'center', marginTop: '4%' }}>Zero3 NFTs</h2>
							<div style={{
								padding: '1% 1%',
								background: 'rgba(255, 255, 255, 0)',
								display: 'flex',
								flexDirection: 'row',
								overflowX: 'auto', // 允许水平滚动
								whiteSpace: 'nowrap', // 确保卡片在同一行
								justifyContent: 'flex-start' // 左对齐
							}}>
								<div style={{ background: 'rgba(255, 255, 255, 0)', margin: '10%' }}>
									{loading && zeroNfts.length === 0 ? (
										<Spin tip="Loading..." />
								) : (
									<Row gutter={16} >
										{zeroNfts.map((nft, index) => (
											<Col span={8} key={`${nft.id}-${index}`} style={{ marginBottom: '16px' }}> {/* 增加每个 Col 的下间隔 */}
												<Card
													hoverable
													style={{ marginBottom: '16px' }} 
													cover={
														<Image
															alt={nft.name}
															preview={false}
															src={nft.image_uri}
															onClick={() => handleImageClick(nft)} // 添加点击事件
															style={{ cursor: 'pointer', marginBottom: '-15%' }} // 鼠标悬停时显示为指针
														/>
													}
												>
													<div style={{ color: '#01050B', height: 'auto', marginBottom: '-30%',marginLeft: '-12%'  }}> {/* 设置 nft.name 的颜色为 #01050B */}
														{nft.name}
													</div>
												</Card>
											</Col>
										))}
									</Row>
								)}
								{/* 添加加载更多按钮 */}
								<div style={{ textAlign: 'center', marginTop: '20px' }}>
									<span
										onClick={hasMoreData ? fetchNftList : null} // 只有在有更多数据时才允许点击
										style={{
											color: hasMoreData ? '#1890ff' : '#ccc', // 根据状态设置文字颜色
											cursor: hasMoreData ? 'pointer' : 'not-allowed', // 根据状态设置鼠标样式
											display: 'inline-block', // 使其表现得像按钮
											textAlign: 'center',
											padding: '10px 20px',
											borderRadius: '4px',
											backgroundColor: 'transparent', // 去掉背景色
											border: 'none', // 去掉边框
											fontSize: '14px', // 设置文字大小
										}}
									>
										{loading ? (
											<FormattedMessage id="loading" />
										) : hasMoreData ? (
											<FormattedMessage id="loadMore" />
										) : (
											<FormattedMessage id="noMore" />
										)}
									</span>
								</div>
							</div>
							</div>
						</Content>
						{/* 模态框显示大图和属性 */}
						<Modal
							title={selectedNft ? selectedNft.name : ""}
							open={isModalVisible}
							onOk={() => isModalVisible(false)}
							onCancel={handleModalClose}
							footer={null}
							width={1000} // 设置模态框的宽度
						>
							{selectedNft && (
								<div style={{ display: 'block', justifyContent: 'space-between', alignItems: 'flex-start', color: '#01050B' }}>
									<Image
										preview={false}
										alt={selectedNft.name}
										src={selectedNft.image_uri}
										style={{ width: '50%', maxHeight: '50%', objectFit: 'contain', marginBottom: '20px' }}
									/>
									<ul style={{ listStyleType: 'none', padding: 0, textAlign: 'left', fontSize: '14px', marginTop: '0', color: '#01050B' }}>
										{selectedNft.attributes_array.map((attr, index) => (
											<li key={index} style={{ lineHeight: '1.5' }}>
												<span style={{ display: 'inline-block' }}>{attr.trait_type}:</span> {attr.value}
											</li>
										))}
									</ul>
								</div>
							)}
						</Modal>
					</Layout >
				</>
			) : (
				<Layout style={{ background: 'rgba(255, 255, 255, 0)' }}>
					<Image
						alt="img"
						src="/resources/images/mintback.png" // 背景图路径
						preview={false} // 禁用预览
						style={{
							position: 'fixed', // 使用 fixed 使其相对于视口固定
							top: 0,
							left: 0,
							width: '100vw', // 设置宽度为视口宽度
							height: '100vh', // 设置高度为视口高度
							objectFit: 'cover', // 确保图片覆盖整个区域
							zIndex: -1 // 确保背景图在其他内容后面
						}}
					/>
					<Content style={{ background: 'rgba(255, 255, 255, 0)' }}> {/* 设置背景色为 #01050B */}
						<h2 style={{ textAlign: 'center', marginTop: '4%' }}>Zero3 Ntfs</h2> {/* 设置居中和顶部间隔 */}
						<div style={{ paddingLeft: '10%', paddingRight: '10%', paddingTop: '2%', paddingBottom: '2%', background: 'rgba(255, 255, 255, 0)' }}>
							{/* <div className="p-5 text-center">
						<button type="button" className="btn btn-success button-25" onClick={fetchNftList}>Fetch NFT List</button>
					</div> */}
							<div style={{ background: 'rgba(255, 255, 255, 0)' }}>
								{loading && zeroNfts.length === 0 ? (
									<Spin tip="Loading..." />
								) : (
									<Row gutter={16} style={{ marginBottom: '16px' }}>
										{zeroNfts.map((nft, index) => (
											<Col span={4} key={`${nft.id}-${index}`} style={{ marginBottom: '16px' }}> {/* 增加每个 Col 的下间隔 */}
												<Card
													hoverable
													cover={
														// style={{
														// 	border: '10px solid transparent', // 设置透明边框
														// 	borderImage: `url(${borderPic}) 10 stretch`, // 使用边框图片
														// }}
														// style={{
														// 	position: 'relative',
														// 	padding: '10px', // 内边距
														// 	background: `url(${borderPic}) no-repeat center/cover`, // 使用背景图片
														// }}
														<Image
															alt={nft.name}
															preview={false}
															src={nft.image_uri}
															onClick={() => handleImageClick(nft)} // 添加点击事件
															style={{ cursor: 'pointer' }} // 鼠标悬停时显示为指针
														/>
													}
												>
													<div style={{ color: '#01050B', fontSize: '18px' }}> {/* 设置 nft.name 的颜色为 #01050B */}
														{nft.name}
													</div>
												</Card>
											</Col>
										))}
									</Row>
								)}
								{/* 添加加载更多按钮 */}
								<div style={{ textAlign: 'center', marginTop: '20px' }}>
									<span
										onClick={hasMoreData ? fetchNftList : null} // 只有在有更多数据时才允许点击
										style={{
											color: hasMoreData ? '#1890ff' : '#ccc', // 根据状态设置文字颜色
											cursor: hasMoreData ? 'pointer' : 'not-allowed', // 根据状态设置鼠标样式
											display: 'inline-block', // 使其表现得像按钮
											textAlign: 'center',
											padding: '10px 20px',
											borderRadius: '4px',
											backgroundColor: 'transparent', // 去掉背景色
											border: 'none', // 去掉边框
											fontSize: '25px', // 设置文字大小
										}}
									>
										{loading ? (
											<FormattedMessage id="loading" />
										) : hasMoreData ? (
											<FormattedMessage id="loadMore" />
										) : (
											<FormattedMessage id="noMore" />
										)}
									</span>
								</div>
							</div>
						</div>
					</Content>

					{/* 模态框显示大图和属性 */}
					<Modal
						title={selectedNft ? selectedNft.name : ""}
						open={isModalVisible}
						onOk={() => isModalVisible(false)}
						onCancel={handleModalClose}
						footer={null}
						width={1000} // 设置模态框的宽度
					>
						{selectedNft && (
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: '#01050B' }}>
								<Image
									preview={false}
									alt={selectedNft.name}
									src={selectedNft.image_uri}
									style={{ width: '300px', height: '300px', objectFit: 'contain', marginBottom: '20px' }}
								/>
								<ul style={{ listStyleType: 'none', padding: 0, textAlign: 'left', marginRight: '15%', fontSize: '18px', marginTop: '0', color: '#01050B' }}>
									{selectedNft.attributes_array.map((attr, index) => (
										<li key={index} style={{ lineHeight: '1.6' }}>
											<span style={{ display: 'inline-block', width: '120px' }}>{attr.trait_type}:</span> {attr.value}
										</li>
									))}
								</ul>
							</div>
						)}
					</Modal>
				</Layout >
			)
			}
		</>
	);
};

export default NftList;