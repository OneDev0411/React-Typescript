import React, { useEffect } from 'react'

import Popper from '@material-ui/core/Popper'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'

import MiniProfile from './MiniProfile'

export type MiniContactType = 'contact' | 'user' | 'insight'

interface MiniContactPropsType {
  type: MiniContactType
  data: {}
  children: React.ReactNode
}

function MiniContact(props: MiniContactPropsType) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const isHovered = Boolean(anchorEl)
  const id = isHovered ? 'simple-popper' : undefined
  function handleHovered(event) {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  return (
    <>
      <div onMouseEnter={handleHovered} onMouseLeave={() => setAnchorEl(null)}>
        {props.children}
        {
          <Popper
            id={id}
            open={isHovered}
            anchorEl={anchorEl}
            transition
            disablePortal
            placement="top-start"
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <MiniProfile initData={props.data} type={props.type} />
                </Paper>
              </Fade>
            )}
          </Popper>
        }
      </div>
    </>
  )
}

export default MiniContact
