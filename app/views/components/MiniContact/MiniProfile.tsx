import React from 'react'

import Avatar from 'components/Avatar'

import Show from './Show'
import Activity from './Activity'
import { MiniContactType, ActionSettingsType } from './types'
import { ProfileContainer } from './styled'
import { get_name } from './helpers'
import useProfile from './useProfile'
import MiniContactActionButton from './MiniContactActionButton'

interface MiniProfilePropsType {
  type: MiniContactType
  initData: {}
  actionSettings: ActionSettingsType
  setActionSettings: (items: ActionSettingsType) => void
}

function MiniProfile(props: MiniProfilePropsType) {
  const output = useProfile(props.type, props.initData)
  const data = output.data
  // const isContact = !!output.contact_id

  return (
    <ProfileContainer>
      <div className="head">
        <Avatar
          title={get_name(data)}
          image={data.profile_image_url}
          size={72}
        />

        <div className="actions">
          <MiniContactActionButton
            isLoading={output.contact_status === 'loading'}
            data={output}
            actionSettings={props.actionSettings}
            setActionSettings={props.setActionSettings}
          />
        </div>
      </div>
      <div className="details">
        <Show if={!!data.name}>
          <div className="person-name">{data.name}</div>
        </Show>
        <Show if={!!data.phone}>
          <div className="person-phone">{data.phone}</div>
        </Show>
        <Show if={!!data.email}>
          <div className="person-email">{data.email}</div>
        </Show>
        <Show if={!!data.address}>
          <div className="person-more-info">
            <div className="person-address">{data.address}</div>
          </div>
        </Show>
      </div>
      <Activity dates={data.dates} />
    </ProfileContainer>
  )
}

export default MiniProfile
