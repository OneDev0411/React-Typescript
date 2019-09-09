import React, { DOMAttributes } from 'react'

interface ComponentRendererPropsType extends DOMAttributes<HTMLElement> {
  as: string
  children: any
}
function ComponentRenderer(props: ComponentRendererPropsType) {
  const { children, as, ...restProps } = props

  return React.createElement(as, restProps, ...children)
}

export default ComponentRenderer
