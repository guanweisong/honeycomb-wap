import React from 'react'
import styles from './index.less'

export interface IconProps {
  name: string
}

const mapping = {
  'clock': require('@/src/assets/svg/clock.svg'),
  'cross': require('@/src/assets/svg/cross.svg'),
  'eye': require('@/src/assets/svg/eye.svg'),
  'left': require('@/src/assets/svg/left.svg'),
  'location': require('@/src/assets/svg/location.svg'),
  'message': require('@/src/assets/svg/message.svg'),
  'photo': require('@/src/assets/svg/photo.svg'),
  'tag': require('@/src/assets/svg/tag.svg'),
  'user': require('@/src/assets/svg/user.svg'),
  'calendar': require('@/src/assets/svg/calendar.svg'),
  'camera': require('@/src/assets/svg/camera.svg'),
}

const Icon = (props: IconProps) => {
  return (
    <img src={mapping[props.name]} className={styles.icon}/>
  )
}

export default Icon
