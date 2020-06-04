import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import { IconButton } from '@material-ui/core'

import PageHeader from '../../../PageHeader'
import { Divider } from '../../../Divider'
import Tooltip from '../../../tooltip'
import IconPrint from '../../../SvgIcons/Print/IconPrint'
import IconClose from '../../../SvgIcons/Close/CloseIcon'

Header.propTypes = {
  ...PageHeader.propTypes,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

Header.propTypes = PageHeader.defaultProps

export function Header(props) {
  const theme = useTheme()

  return (
    <PageHeader
      title={props.title}
      showBackButton={false}
      className={props.className}
      style={{
        width: '100%',
        height: 'auto',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
        margin: 0,
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper
      }}
    >
      <PageHeader.Menu>
        <Tooltip placement="bottom" caption="Print">
          <IconButton onClick={window.print}>
            <IconPrint size="medium" />
          </IconButton>
        </Tooltip>
        <Divider width="1px" height="1.5rem" margin="0 1.5rem" />
        <Tooltip placement="bottom" caption="Close">
          <IconButton onClick={props.handleClose}>
            <IconClose size="medium" />
          </IconButton>
        </Tooltip>
      </PageHeader.Menu>
    </PageHeader>
  )
}
