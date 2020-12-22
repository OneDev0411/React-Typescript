import React from 'react'
import { Button, makeStyles, Theme } from '@material-ui/core'
import { Link } from 'react-router'

import { useSelector } from 'react-redux'

import { getNameInitials } from 'utils/helpers.js'

import CopyButton from 'components/CopyButton'
import { EmailComposeFormProps } from 'components/EmailCompose'
import { Avatar } from 'components/Avatar'

import { selectUser } from 'selectors/user'

import { IAppState } from 'reducers'

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

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(9),
    height: theme.spacing(9),
    backgroundColor: theme.palette.divider,
    color: theme.palette.text.primary
  }
}))

interface MiniProfilePropsType {
  type: MiniContactType
  initData: any
  actionSettings: ActionSettingsType
  setActionSettings: (items: ActionSettingsType) => void
  onSubmit?(event: IEvent, type: string): void
}

export default function MiniProfile({
  type,
  initData,
  actionSettings,
  setActionSettings,
  onSubmit
}: MiniProfilePropsType) {
  const user = useSelector(selectUser)
  const attributeDefs = useSelector(
    ({ contacts }: IAppState) => contacts.attributeDefs
  )

  const output = useProfile(type, initData, attributeDefs)
  const data = output.data

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
            actionSettings={actionSettings}
            setActionSettings={setActionSettings}
            onSubmit={onSubmit}
            user={user}
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
              onClick={() =>
                setActionSettings({
                  type: ActionSettingsNamesType.EMAIL,
                  data: {
                    initialValues: {
                      to: [
                        {
                          recipient_type: 'Email',
                          email: data.email,
                          contact:
                            initData.type === 'contact' ? initData : undefined
                        }
                      ]
                    },
                    onClose: () => setActionSettings({}),
                    onSent: () => setActionSettings({})
                  } as Partial<EmailComposeFormProps>
                })
              }
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
