import React from 'react'

// import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'

import { EventDrawer } from 'components/EventDrawer'
import NewContactDrawer from 'components/CreateContact/NewContactDrawer'
import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import ContentSizeAwarePopper from 'components/ContentSizeAwarePopper'

import MiniProfile from './MiniProfile'
import {
  ActionSettingsType,
  MiniContactType,
  ActionSettingsNamesType
} from './types'

interface MiniContactPropsType {
  type: MiniContactType
  data: {}
  children: React.ReactNode
}

function MiniContact(props: MiniContactPropsType) {
  // It should be here because after leaving out the moust, it will be lost if it's inside the component
  const [actionSettings, setActionSettings] = React.useState<
    ActionSettingsType
  >({})
  const [anchorEl, setAnchorEl] = React.useState(null)
  const isHovered = Boolean(anchorEl)
  const id = isHovered ? 'mini-contact-popper' : undefined

  function handleHovered(event) {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  return (
    <>
      <div onMouseEnter={handleHovered} onMouseLeave={() => setAnchorEl(null)}>
        {props.children}
        {isHovered && (
          <ContentSizeAwarePopper
            id={id}
            open={isHovered}
            anchorEl={anchorEl}
            transition
            // disablePortal
            placement="top-start"
            style={{ zIndex: 2019 }}
          >
            {/* Disable the animation temporarily  */}
            {/* {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}> */}
            <Paper>
              <MiniProfile
                initData={props.data}
                type={props.type}
                actionSettings={actionSettings}
                setActionSettings={setActionSettings}
              />
            </Paper>
            {/* </Fade>
            )} */}
          </ContentSizeAwarePopper>
        )}
      </div>
      {actionSettings.type === ActionSettingsNamesType.EVENT && (
        <EventDrawer {...actionSettings.data} isOpen />
      )}
      {actionSettings.type === ActionSettingsNamesType.CONTACT && (
        <NewContactDrawer {...actionSettings.data} isOpen />
      )}
      {actionSettings.type === ActionSettingsNamesType.EMAIL && (
        <SingleEmailComposeDrawer {...actionSettings.data} isOpen />
      )}
    </>
  )
}

export default MiniContact
