import React from 'react'

import { useTheme } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import useDebouncedCallback from 'use-debounce/lib/callback'

import ContentSizeAwarePopper from 'components/ContentSizeAwarePopper'
import NewContactDrawer from 'components/CreateContact/NewContactDrawer'
import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import { EventDrawer } from 'components/EventDrawer'

import ComponentRenderer from './MiniContactComponenetRenderer'
import MiniProfile from './MiniProfile'
import {
  ActionSettingsNamesType,
  ActionSettingsType,
  MiniContactType
} from './types'

interface MiniContactPropsType {
  type: MiniContactType
  data: object
  children: React.ReactNode
  as?: string
  onEventChange?(event: IEvent, type: string): void
}

function MiniContact(props: MiniContactPropsType) {
  // It should be here because after leaving out the mouse, it will be lost if it's inside the component
  const [actionSettings, setActionSettings] =
    React.useState<ActionSettingsType>({})
  const [anchorEl, setAnchorEl] = React.useState(null)
  const theme = useTheme()

  function handleHovered(currentTarget) {
    setAnchorEl(anchorEl ? null : currentTarget)
  }

  let [debouncedHandleHovered, cancel] = useDebouncedCallback(
    handleHovered,
    500
  )
  const isHovered = Boolean(anchorEl)
  const id = isHovered ? 'mini-contact-popper' : undefined
  const closeMiniContact = () => {
    setAnchorEl(null)
    cancel()
  }

  return (
    <>
      <ComponentRenderer
        as={props.as || 'div'}
        onMouseEnter={e => debouncedHandleHovered(e.currentTarget)}
        onMouseLeave={closeMiniContact}
      >
        {props.children}
        {isHovered && (
          <ContentSizeAwarePopper
            id={id}
            open={isHovered}
            anchorEl={anchorEl}
            transition
            placement="bottom-start"
            style={{ zIndex: theme.zIndex.modal }}
          >
            <Paper>
              <MiniProfile
                initData={props.data}
                type={props.type}
                actionSettings={actionSettings}
                setActionSettings={setActionSettings}
                onSubmit={props.onEventChange}
              />
            </Paper>
          </ContentSizeAwarePopper>
        )}
      </ComponentRenderer>
      {actionSettings.type === ActionSettingsNamesType.EVENT && (
        <EventDrawer {...actionSettings.data} isOpen />
      )}
      {actionSettings.type === ActionSettingsNamesType.CONTACT && (
        <NewContactDrawer
          {...actionSettings.data}
          isOpen
          showAddAnother={false}
        />
      )}
      {actionSettings.type === ActionSettingsNamesType.EMAIL && (
        <SingleEmailComposeDrawer {...actionSettings.data} isOpen />
      )}
    </>
  )
}

export default MiniContact
