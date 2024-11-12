import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { animated, useSpring, useTrail } from 'react-spring';
import { Image } from 'antd';

const MouseParallaxContext = createContext();

const MouseParallaxProvider = ({ children }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [springProps, api] = useSpring(() => ({ x: 0, y: 0 }));

    const handleMouseMove = useCallback((e) => {
        const { clientX, clientY } = e;
        setMousePos({ x: clientX, y: clientY });
        api.start({
            // x: (clientX - window.innerWidth / 2) / 5, // 减小分母以增加移动距离
            // y: (clientY - window.innerHeight / 2) / 5, // 减小分母以增加移动距离
            // config: { tension: 200, friction: 30 }, // 调整弹簧配置

            x: (clientX - window.innerWidth / 2) / 1, // 减小分母以增加移动距离
            y: (clientY - window.innerHeight / 2) / 1, // 减小分母以增加移动距离
            config: { tension: 100, friction: 20 }, // 调整弹簧配置
        });
    }, [api]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [handleMouseMove]);

    return (
        <MouseParallaxContext.Provider value={springProps}>
            <div style={{ overflow: 'hidden', position: 'relative', width: '100vw', height: '100vh' }}>
                {children}
            </div>
        </MouseParallaxContext.Provider>
    );
};

const ParallaxImage = ({ src, style, index, onLoadComplete }) => {
    const springProps = useContext(MouseParallaxContext);

    // 设置速度因子
    const speedFactor = index < 5 ? 10 : 20; // 减小速度因子以增加移动速度

    const trail = useTrail(4, {
        opacity: springProps.x.to(x => (x ? 1 : 0)),
        transform: springProps.x.to(x => `translateX(${x / speedFactor}px)`), // 根据速度因子调整移动速度
        config: { tension: 300, friction: 60 }, // 调整弹簧配置
    });

    return (
        <animated.div
            style={{
                backgroundSize: 'cover',
                width: '100%',
                height: '100%',

                backgroundImage: 'url($(src})',
                backgroundsize: '100%100%',
                position: 'absolute',
                marginLeft: '0%',
                left: '0',
                top: '0',
                ...style,
                ...trail[index], //使用trail的样式
            }}
        >
            <Image
                src={src}
                preview={false}
                alt={`Parallax ${index}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} // 确保图像覆盖整个区域
                onLoad={onLoadComplete} // 监听加载完成事件
                onError={() => console.error(`Failed to load image: ${src}`)} // 处理加载错误
            />
        </animated.div>
    );
};

const MouseParallax = ({ onLoadComplete }) => {
    const images = [
        "/resources/images/home/1.png",
        "/resources/images/home/2.png",
        "/resources/images/home/3.png",
        "/resources/images/home/4.png"
    ];

    const [loadedImages, setLoadedImages] = useState(0);

    const handleImageLoad = () => {
        setLoadedImages(prev => prev + 1);
    };

    useEffect(() => {
        if (loadedImages === images.length) {
            onLoadComplete(); // 所有图像加载完成时调用回调
        }
    }, [loadedImages, images.length, onLoadComplete]);

    return (
        <MouseParallaxProvider>
            {images.map((src, index) => (
                <ParallaxImage key={index} src={src} style={{ zIndex: index + 1 }} index={index} onLoadComplete={handleImageLoad} />
            ))}
        </MouseParallaxProvider>
    );
};

export default MouseParallax;