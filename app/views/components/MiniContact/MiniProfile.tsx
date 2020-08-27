import React from 'react'
import { connect } from 'react-redux'
import { Button, makeStyles, createStyles, Theme } from '@material-ui/core'
import { Link } from 'react-router'

import { getNameInitials } from 'utils/helpers.js'

import CopyButton from 'components/CopyButton'
import { EmailComposeFormProps } from 'components/EmailCompose'
import { Avatar } from 'components/GeneralAvatar'
import { IAppState } from 'reducers'
import { IAttributeDefsState } from 'reducers/contacts/attributeDefs'

import { getName } from './helpers'

import Activity from './Activity'
import {
  MiniContactType,
  ActionSettingsType,
  ActionSettingsNamesType
} from './types'
import { ProfileContainer } from './styled'
import useProfile from './useProfile'
import MiniContactActionButton from './MiniContactActionButton'
import MiniContactSocialMedias from './MiniContactSocialMedias'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: 72,
      height: 72,
      backgroundColor: theme.palette.divider,
      color: theme.palette.text.primary
    }
  })
)

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
  const classes = useStyles()

  return (
    <ProfileContainer>
      <div className="head">
        <Avatar
          alt={getName(data)}
          contact={data as IContact}
          className={classes.avatar}
        >
          {getNameInitials(getName(data))}
        </Avatar>

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
            {!!output.contact_id && (
              <Link
                target="blank"
                to={`/dashboard/contacts/${output.contact_id}`}
              >
                <Button color="primary">View Profile</Button>
              </Link>
            )}
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
