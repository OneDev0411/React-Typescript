import React from 'react'
import { Button, ButtonGroup, Box } from '@material-ui/core'
import { Editor } from 'grapesjs'

interface Props {
  editor: Editor
}

export default function DeviceManager({ editor }: Props) {
  function setDevice(name: 'Desktop' | 'Tablet' | 'Mobile portrait') {
    editor.setDevice(name)
  }

  return (
    <Box ml={2}>
      <ButtonGroup size="small">
        <Button variant="outlined" onClick={() => setDevice('Desktop')}>
          Desktop
        </Button>
        <Button variant="outlined" onClick={() => setDevice('Tablet')}>
          Tablet
        </Button>
        <Button variant="outlined" onClick={() => setDevice('Mobile portrait')}>
          Mobile
        </Button>
      </ButtonGroup>
    </Box>
  )
}
