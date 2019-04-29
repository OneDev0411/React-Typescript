import React from 'react'

import Menu from './Menu'
import { InsightsHeader } from '../styled'
import { H1 } from '../../../../../../views/components/Typography/headings'

Header.defaultProps = {
  title: ''
}
function Header(props) {
  return (
    <InsightsHeader justifyBetween>
      <div>
        <H1 style={{ lineHeight: 1.5 }}>{props.title.trim() || 'No Title'}</H1>
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
