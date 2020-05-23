import React, { useState } from 'react'
import { IconButton, Tooltip, makeStyles } from '@material-ui/core'
import { fade } from '@material-ui/core/styles'

import { Editor } from 'grapesjs'

import { mdiMonitor } from '@mdi/js'

import Icon from '@mdi/react'

import { mdiCellphone } from '@mdi/js'

import { useIconStyles } from 'views/../styles/use-icon-styles'

const useStyles = makeStyles(theme => ({
  selected: {
    backgroundColor: fade(theme.palette.primary.main, 0.14)
  }
}))

interface Props {
  editor: Editor
}

type Device = 'Desktop' | 'Mobile portrait'

export default function DeviceManager({ editor }: Props) {
  const [selectedDevice, setSelectedDevice] = useState<Device>('Desktop')

  const classes = useStyles()
  const iconClasses = useIconStyles()

  const isDesktop = selectedDevice === 'Desktop'
  const isMobile = selectedDevice === 'Mobile portrait'

  function setDevice(name: Device) {
    editor.setDevice(name)
    setSelectedDevice(name)
  }

  return (
    <>
      <Tooltip title="Preview in Desktop">
        <IconButton
          onClick={() => setDevice('Desktop')}
          className={isDesktop ? classes.selected : ''}
        >
          <Icon
            path={mdiMonitor}
            size={1}
            className={isDesktop ? iconClasses.active : ''}
          />
        </IconButton>
      </Tooltip>

      <Tooltip title="Preview in Phone">
        <IconButton
          onClick={() => setDevice('Mobile portrait')}
          className={isMobile ? classes.selected : ''}
        >
          <Icon
            path={mdiCellphone}
            size={1}
            className={isMobile ? iconClasses.active : ''}
          />
        </IconButton>
      </Tooltip>
    </>
  )
}
