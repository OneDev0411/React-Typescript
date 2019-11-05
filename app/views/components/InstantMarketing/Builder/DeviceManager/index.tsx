import React, { useState } from 'react'
import {
  Button,
  ButtonGroup,
  Box,
  Tooltip,
  makeStyles
} from '@material-ui/core'
import { Editor } from 'grapesjs'

import MobileIcon from 'components/SvgIcons/Mobile/IconMobile'
import TabletIcon from 'components/SvgIcons/Tablet/IconTablet'
import DesktopIcon from 'components/SvgIcons/Desktop/IconDesktop'

const useStyles = makeStyles(theme => ({
  selected: {
    backgroundColor: theme.palette.action.disabled,
    color: `${theme.palette.common.black} !important`,
    borderColor: theme.palette.common.black
  },
  btnGroup: {
    height: 32
  }
}))

interface Props {
  editor: Editor
}

type Device = 'Desktop' | 'Tablet' | 'Mobile portrait'

export default function DeviceManager({ editor }: Props) {
  const [selectedDevice, setSelectedDevice] = useState<Device>('Desktop')
  const classes = useStyles()
  const isDesktop = selectedDevice === 'Desktop'
  const isTablet = selectedDevice === 'Tablet'
  const isMobile = selectedDevice === 'Mobile portrait'

  function setDevice(name: Device) {
    editor.setDevice(name)
    setSelectedDevice(name)
  }

  return (
    <Box ml={2}>
      <ButtonGroup className={classes.btnGroup}>
        <Tooltip title="Preview in Desktop">
          <Button
            disabled={isDesktop}
            variant="outlined"
            color={isDesktop ? 'primary' : 'default'}
            onClick={() => setDevice('Desktop')}
            className={isDesktop ? classes.selected : ''}
          >
            <DesktopIcon />
          </Button>
        </Tooltip>

        <Tooltip title="Preview in Tablet">
          <Button
            disabled={isTablet}
            variant="outlined"
            color={isTablet ? 'primary' : 'default'}
            onClick={() => setDevice('Tablet')}
            className={isTablet ? classes.selected : ''}
          >
            <TabletIcon />
          </Button>
        </Tooltip>

        <Tooltip title="Preview in Phone">
          <Button
            disabled={isMobile}
            variant="outlined"
            color={isMobile ? 'primary' : 'default'}
            onClick={() => setDevice('Mobile portrait')}
            className={isMobile ? classes.selected : ''}
          >
            <MobileIcon />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Box>
  )
}
