/**
 *  mode说明：
 *  scaleToFill：缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
 *  widthFix：缩放模式，宽度不变，高度自动变化，保持原图宽高比不变
 *  heightFix： 缩放模式，高度不变，宽度自动变化，保持原图宽高比不变
 *  aspectFit:  缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来
 *  aspectFill: 缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取
 *
 ***/
import React, { useEffect, useState, useRef } from 'react'
import './style.less';
import classnames from 'classnames';
import 'lazysizes/plugins/attrchange/ls.attrchange'
import 'lazysizes'
import defaultImg from '@/assets/default.png'

export default function(props) {
  const {
    src,
    width,
    height,
    style,
    className,
    mode = 'scaleToFill',
    ...external
  } = props;

  // 设置超长类或者超宽类
  const [superClass, setSuperClass] = useState()

  // 组件容器的ref,用于获取长宽
  const refPicture = useRef(null)

  const onError = (e) => {
    e.target.src = props.default ? props.default : defaultImg
    setMode(defaultImg)
  };

  const setMode = (src=src) => {
    const img = new Image()
    img.src = src || defaultImg

    // 设定开始时间
    const startDate = new Date().getTime()

    // 以最宽的速度获取图片的宽高
    const interval = setInterval(() => {
      if(img.width && refPicture.current) {
        // 清除定时器
        clearInterval(interval)

        const { width, height } = img
        const { offsetWidth, offsetHeight } = refPicture.current
        // 判定是超宽还是超长的图片
        let superWidth = false
        if(width/height > offsetWidth/offsetHeight) {
          superWidth = true
        }

        setSuperClass(superWidth ? 'superWidth' : 'superHeight')
      }
      if (new Date().getTime() - startDate > 20000) {
        clearInterval(interval)
      }
    }, 40)
  }

  useEffect(() => {
    setMode()
  }, [src])

  return (
    <div
      className={classnames('picture', {
        [mode]: !!mode,
        [className]: !!className,
        [superClass]: !!superClass
      })}
      style={{ width, height, ...style }}
      ref={refPicture}
    >
      <img
        className="lazyload"
        data-src={src ? src : defaultImg}
        alt="images"
        onError={onError}
        {...external}
      />
    </div>
  );
}

