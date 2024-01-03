import React from 'react'
import Link from 'next/link'

import classes from '@/styles/customLink.module.scss'

interface ICustomLink {
  link: string
  content: any
}

const CustomLink = (props: ICustomLink) => {
  return (
    <Link href={props.link} className={classes.customLinks}>
      {props.content}
    </Link>
  )
}

export default CustomLink
