import React, {useEffect, useState} from 'react'
import { useScroll } from 'ahooks'
import { ToTopOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

const BackToTop = () => {
  const scroll = useScroll()
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(scroll.top > 300)
  }, [scroll.top])

  const goTop = () => {
    window.scrollTo(0, 0)
  }

  return show ? <div className={styles["back-to-top"]} onClick={goTop}><ToTopOutlined /></div> : <></>

}

export default BackToTop
