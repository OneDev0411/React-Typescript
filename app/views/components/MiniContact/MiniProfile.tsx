import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router'

import Avatar from 'components/Avatar'
import copy from 'utils/copy-text-to-clipboard'

import Show from './Show'
import Activity from './Activity'
import {
  MiniContactType,
  ActionSettingsType,
  ActionSettingsNamesType
} from './types'
import { ProfileContainer } from './styled'
import { get_name } from './helpers'
import useProfile from './useProfile'
import MiniContactActionButton from './MiniContactActionButton'
import MiniContactIcons from './MiniContactIcons'

interface MiniProfilePropsType {
  type: MiniContactType
  initData: {}
  actionSettings: ActionSettingsType
  setActionSettings: (items: ActionSettingsType) => void
  user: any
}

function MiniProfile(props: MiniProfilePropsType) {
  const output = useProfile(props.type, props.initData)
  const data = output.data
  const emailProps = {
    type: ActionSettingsNamesType.EMAIL,
    data: {
      from: props.user,
      onClose: () => props.setActionSettings({}),
      onSent: () => props.setActionSettings({})
    }
  }

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
            user={props.user}
          />
        </div>
      </div>
      <div className="details">
        <Show if={!!data.name}>
          <div className="person-name">
            {data.name}{' '}
            <Link to={`/dashboard/contacts/${output.contact_id}`}>
              <Button color="primary">View Profile</Button>
            </Link>
          </div>
        </Show>
        <Show if={!!data.phone}>
          <div className="person-phone">
            {data.phone}{' '}
            <Button color="primary" onClick={() => copy(data.phone)}>
              Copy
            </Button>
          </div>
        </Show>
        <Show if={!!data.email}>
          <div className="person-email">
            {data.email}{' '}
            <Button
              color="primary"
              onClick={() => props.setActionSettings(emailProps)}
            >
              Send Email
            </Button>
          </div>
        </Show>
        <Show if={!!data.address}>
          <div className="person-more-info">
            <div className="person-address">
              {data.address}{' '}
              <Button color="primary" onClick={() => copy(data.address)}>
                Copy
              </Button>
            </div>
          </div>
        </Show>
        <MiniContactIcons socials={data.socials} />
      </div>
      <Activity dates={data.dates} last_touch={data.last_touch} />
    </ProfileContainer>
  )
}

function reduxState(state) {
  return {
    user: state.user
  }
}

export default connect(reduxState)(MiniProfile)
