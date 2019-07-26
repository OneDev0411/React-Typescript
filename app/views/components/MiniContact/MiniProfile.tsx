import React from 'react'

import Avatar from 'components/Avatar'
import Button from 'components/Button/LinkButton'
import copy from 'utils/copy-text-to-clipboard'

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
          <div className="person-name">
            {data.name}{' '}
            <Button to={`/dashboard/contacts/${output.contact_id}`}>
              View Profile
            </Button>
          </div>
        </Show>
        <Show if={!!data.phone}>
          <div className="person-phone">
            {data.phone} <Button onClick={() => copy(data.phone)}>Copy</Button>
          </div>
        </Show>
        <Show if={!!data.email}>
          <div className="person-email">
            {data.email} <Button>Send Email</Button>
          </div>
        </Show>
        <Show if={!!data.address}>
          <div className="person-more-info">
            <div className="person-address">
              {data.address}{' '}
              <Button onClick={() => copy(data.address)}>Copy</Button>
            </div>
          </div>
        </Show>
      </div>
      <Activity dates={data.dates} />
    </ProfileContainer>
  )
}

export default MiniProfile
