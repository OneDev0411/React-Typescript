import React, { useState } from 'react'
import { Button, ButtonGroup, Box } from '@material-ui/core'
import { Editor } from 'grapesjs'

interface Props {
  editor: Editor
}

type Device = 'Desktop' | 'Tablet' | 'Mobile portrait'

export default function DeviceManager({ editor }: Props) {
  const [selectedDevice, setSelectedDevice] = useState<Device>('Desktop')

  function setDevice(name: Device) {
    editor.setDevice(name)
    setSelectedDevice(name)
  }

  return (
    <Box ml={2}>
      <ButtonGroup size="small">
        <Button
          disabled={selectedDevice === 'Desktop'}
          variant="outlined"
          color={selectedDevice === 'Desktop' ? 'primary' : 'default'}
          onClick={() => setDevice('Desktop')}
        >
          Desktop
        </Button>
        <Button
          disabled={selectedDevice === 'Tablet'}
          variant="outlined"
          color={selectedDevice === 'Tablet' ? 'primary' : 'default'}
          onClick={() => setDevice('Tablet')}
        >
          Tablet
        </Button>
        <Button
          disabled={selectedDevice === 'Mobile portrait'}
          variant="outlined"
          color={selectedDevice === 'Mobile portrait' ? 'primary' : 'default'}
          onClick={() => setDevice('Mobile portrait')}
        >
          Mobile
        </Button>
      </ButtonGroup>
    </Box>
  )
}
