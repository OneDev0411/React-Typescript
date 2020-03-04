import React from 'react'
import { Avatar, makeStyles, createStyles, Theme } from '@material-ui/core'

import { ContactInfoContainer } from './styled'
import ContactName from './ContactName'

import { ContactsListType } from '../../../components/Pages/Dashboard/MarketingInsights/Insight/types'

interface ContactInfoPropsType {
  data: ContactsListType
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      backgroundColor: theme.palette.divider,
      color: theme.palette.text.primary
    }
  })
)

function ContactInfo({ data }: ContactInfoPropsType) {
  const classes = useStyles()
  const title = data.display_name || data.to

  return (
    <ContactInfoContainer>
      <div className="profile-picture">
        <Avatar
          alt={title}
          src={data.profile_image_url || ''}
          sizes="32"
          className={classes.avatar}
        >
          {title.substring(0, 1)}
        </Avatar>
      </div>
      <div className="profile-info">
        <ContactName data={data} />
        {data.to && <span>{data.to}</span>}
      </div>
    </ContactInfoContainer>
  )
}

export default ContactInfo
