import React from 'react';
import { useSpring, useSprings, useTransition, animated, to } from 'react-spring';

const calc = (x, y) => {
  console.log("✈ ~ x:", x)
  console.log("✈ ~ y:", y)
  return [((x > 0 && (window.innerWidth > x + 10)) ? (window.innerWidth / 2 - x) : 0),
  ((y > 50 && (window.innerHeight > y + 10)) ? (window.innerHeight / 2 - y) : 0)]
}
const trans1 = (x, y) => `translate3d(${x / 20}px,${y / 20}px, 0)`
const trans2 = (x, y) => `translate3d(${x / 15}px,${y / 15}px, 0)`
const trans3 = (x, y) => `translate3d(${x / 12}px,${y / 12}px, 0)`
const trans4 = (x, y) => `translate3d(${x / 10}px,${y / 10}px, 0)`

const ParallaxBackground = () => {
  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 2, tension: 600, friction: 50 },
  }))
  //   const layers = [
  //     "/resources/images/home/1.png",
  //     "/resources/images/home/2.png",
  //     "/resources/images/home/3.png",
  //     "/resources/images/home/4.png"
  //   ];

  //   const calc = (x, y) => [x * 0.00003, y * 0.00003];

  return (
    // <Parallax calcOffset={calc}>
    //   {layers.map((layer, index) => (
    //     <div
    //       key={index}
    //       style={{
    //         position: 'absolute',
    //         width: '100%',
    //         height: '100%',
    //         backgroundImage: `url(${layer})`,
    //         backgroundSize: 'cover',
    //         backgroundPosition: 'center',
    //         willChange: 'transform',
    //       }}
    //     />
    //   ))}
    // </Parallax>
    <div
      className="mouse-parallaz-container"
      onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}>
      <animated.div className="paraChild item1" style={{ transform: to(props.xy, trans1) }} />
      <animated.div className="paraChild item2" style={{ transform: to(props.xy, trans2) }} />
      <animated.div className="paraChild item3" style={{ transform: to(props.xy, trans3) }} />
      <animated.div className="paraChild item4" style={{ transform: to(props.xy, trans4) }} />
    </div>
  );
};

export default ParallaxBackground;