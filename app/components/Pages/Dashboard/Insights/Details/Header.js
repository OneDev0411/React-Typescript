import React from 'react'

import Menu from './Menu'
import { InsightsHeader } from './styled'
import { H1 } from '../../../../../views/components/Typography/headings'
import { show_title } from '../Main/helpers'

Header.defaultProps = {
  title: ''
}
function Header(props) {
  return (
    <InsightsHeader justifyBetween>
      <div>
        <H1 style={{ lineHeight: 1.5 }}>{show_title(props.title)}</H1>
      </div>
      <div>
        <Menu
          backUrl={props.backUrl}
          closeButtonQuery={props.closeButtonQuery}
        />
      </div>
    </InsightsHeader>
  )
}

export default Header
