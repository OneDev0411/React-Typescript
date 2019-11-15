import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router'

import Avatar from 'components/Avatar'
import CopyButton from 'components/CopyButton'
import { EmailComposeFormProps } from 'components/EmailCompose'
import { IAppState } from 'reducers'
import { IAttributeDefsState } from 'reducers/contacts/attributeDefs'
import { normalizeUserForEmailFrom } from 'models/email/helpers/normalize-user-for-email-from'

import Activity from './Activity'
import {
  MiniContactType,
  ActionSettingsType,
  ActionSettingsNamesType
} from './types'
import { ProfileContainer } from './styled'
import { getName } from './helpers'
import useProfile from './useProfile'
import MiniContactActionButton from './MiniContactActionButton'
import MiniContactSocialMedias from './MiniContactSocialMedias'

interface MiniProfilePropsType {
  type: MiniContactType
  initData: {}
  actionSettings: ActionSettingsType
  user: IUser
  attributeDefs: IAttributeDefsState
  setActionSettings: (items: ActionSettingsType) => void
  onSubmit?(event: IEvent, type: string): void
}

function MiniProfile(props: MiniProfilePropsType) {
  const output = useProfile(props.type, props.initData, props.attributeDefs)
  const data = output.data
  const emailProps = {
    type: ActionSettingsNamesType.EMAIL,
    data: {
      initialValues: {
        from: normalizeUserForEmailFrom(props.user),
        to: [
          {
            recipient_type: 'Email',
            email: data.email
          }
        ]
      },
      onClose: () => props.setActionSettings({}),
      onSent: () => props.setActionSettings({})
    } as Partial<EmailComposeFormProps>
  }

  return (
    <ProfileContainer>
      <div className="head">
        <Avatar
          title={getName(data)}
          image={data.profile_image_url}
          size={72}
        />

        <div className="actions">
          <MiniContactActionButton
            isLoading={output.contact_status === 'loading'}
            data={output}
            actionSettings={props.actionSettings}
            setActionSettings={props.setActionSettings}
            onSubmit={props.onSubmit}
            user={props.user}
          />
        </div>
      </div>
      <div className="details">
        {!!data.name && (
          <div className="person-name">
            <span>{data.name}</span>
            <Link to={`/dashboard/contacts/${output.contact_id}`}>
              <Button color="primary">View Profile</Button>
            </Link>
          </div>
        )}
        {data.phone && (
          <div className="person-phone">
            {data.phone} <CopyButton text={data.phone} />
          </div>
        )}
        {!!data.email && (
          <div className="person-email">
            <span>{data.email}</span>
            <Button
              color="primary"
              onClick={() => props.setActionSettings(emailProps)}
            >
              Send Email
            </Button>
          </div>
        )}
        {!!data.address && (
          <div className="person-more-info">
            <div className="person-address">
              {data.address} <CopyButton text={data.address} />
            </div>
          </div>
        )}
        <MiniContactSocialMedias socials={data.socials} />
      </div>
      <Activity
        dates={data.dates}
        last_touch={data.last_touch}
        contactId={output.contact_id}
      />
    </ProfileContainer>
  )
}

function mapStateToProps(state: IAppState) {
  return {
    user: state.user,
    attributeDefs: state.contacts.attributeDefs
  }
}

export default connect(mapStateToProps)(MiniProfile)
