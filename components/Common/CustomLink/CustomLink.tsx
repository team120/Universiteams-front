import React from 'react'
import Link from 'next/link'

interface ICustomLink {
  link: string
  content: any
}

const CustomLink = (props: ICustomLink) => {
  return (
    <Link href={props.link} className="customLink">
      {props.content}
    </Link>
  )
}

export default CustomLink
