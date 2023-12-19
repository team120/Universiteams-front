import React from 'react'

const Layout = (props: any) => (
  <div id="layout">
    <div className="test">TestLayout</div>
    {props.children}
  </div>
)

export default Layout
