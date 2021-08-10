import React from "react"
import styles from "./index.module.scss"

export interface BlockProps {
  title: string
  children: React.ReactElement
}

const Card = (props: BlockProps) => {

  const { title, children } = props

  return (
    <div className={styles["card"]}>
      <div className={styles["card__title"]}>{title}</div>
      <div className={styles["card__content"]}>
        {children}
      </div>
    </div>
  )
}

export default Card
