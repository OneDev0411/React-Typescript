import React from 'react'
import PropTypes from 'prop-types'

// import IconButton from '../../../../../../../views/components/Button/IconButton'
// import MenuIcon from '../../../../../../../views/components/SvgIcons/MoreVert'

import { Header, Title } from './styled'
// import Tooltip from '../../../../../../../views/components/tooltip'

Section.propTypes = {
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  title: PropTypes.string
}

export function Section(props) {
  return (
    <div>
      <Header alignCenter justifyBetween>
        <Title>{props.title}</Title>
      </Header>
      <div>{props.children}</div>
    </div>
  )
}
