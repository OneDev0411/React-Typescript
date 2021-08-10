import React from 'react'

import { IconButton, Tooltip } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { mdiClose } from '@mdi/js'
import PropTypes from 'prop-types'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { printOutlined } from 'components/SvgIcons/icons'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { Divider } from '../../../Divider'
import PageHeader from '../../../PageHeader'

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
        <Tooltip placement="bottom" title="Print">
          <IconButton onClick={window.print}>
            <SvgIcon path={printOutlined} size={muiIconSizes.large} />
          </IconButton>
        </Tooltip>
        <Divider width="1px" height="1.5rem" margin="0 1.5rem" />
        <Tooltip placement="bottom" title="Close">
          <IconButton onClick={props.handleClose}>
            <SvgIcon path={mdiClose} size={muiIconSizes.large} />
          </IconButton>
        </Tooltip>
      </PageHeader.Menu>
    </PageHeader>
  )
}
