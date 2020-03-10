import React from 'react'
import {
  Box,
  Tooltip,
  Avatar,
  Typography,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'

import ContactName from './ContactName'

import { ContactsListType } from '../../../components/Pages/Dashboard/MarketingInsights/Insight/types'

interface ContactInfoPropsType {
  data: ContactsListType
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      width: `calc(100% - ${theme.spacing(3)}px)`
    },
    userDetails: {
      textAlign: 'left',
      marginLeft: theme.spacing(1),
      width: `calc(100% - ${theme.spacing(6)}px)`
    },
    userEmail: {
      color: theme.palette.grey[400]
    },
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
    <Box className={classes.wrapper}>
      <Avatar
        alt={title}
        src={data.profile_image_url || ''}
        sizes="32"
        className={classes.avatar}
      >
        {title.substring(0, 1).toUpperCase()}
      </Avatar>
      <div className={classes.userDetails}>
        <Typography noWrap variant="body2">
          <ContactName data={data} />
        </Typography>
        {data.to && title !== data.to && (
          <Tooltip title={data.to}>
            <Typography
              noWrap
              variant="body2"
              display="block"
              className={classes.userEmail}
            >
              {data.to}
            </Typography>
          </Tooltip>
        )}
      </div>
    </Box>
  )
}

export default ContactInfo
