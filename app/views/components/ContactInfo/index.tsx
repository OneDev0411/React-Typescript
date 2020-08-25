import React from 'react'
import { Box, Tooltip, Theme, useTheme } from '@material-ui/core'

import ContactName from 'components/ContactInfo/ContactName'
import { Avatar } from 'components/GeneralAvatar'
import { getContactNameInitials } from 'models/contacts/helpers'

import { ContactsListType } from '../../../components/Pages/Dashboard/MarketingInsights/Insight/types'

interface ContactInfoPropsType {
  data: ContactsListType
}

/**
 * IMPORTANT: this component is refactored based on inline-styles
 * becuase it's heavily using in Grids (Insight,Contact) and running
 * a bunch of JSS styles makes the webpage deadly slow
 */
function ContactInfo({ data }: ContactInfoPropsType) {
  const theme = useTheme<Theme>()
  const title = data.display_name || data.to

  return (
    <Box display="flex" alignItems="center" width="100%">
      <Avatar alt={title} url={data.profile_image_url || ''}>
        {getContactNameInitials(data)}
      </Avatar>
      <div
        style={{
          textAlign: 'left',
          marginLeft: theme.spacing(1),
          width: `calc(100% - ${theme.spacing(6)}px)`
        }}
      >
        <div
          style={{
            whiteSpace: 'nowrap',
            ...theme.typography.body2
          }}
        >
          <ContactName data={data} />
        </div>
        {data.to && title !== data.to && (
          <Tooltip title={data.to}>
            <div
              style={{
                display: 'block',
                whiteSpace: 'nowrap',
                color: theme.palette.grey[400],
                ...theme.typography.body2
              }}
            >
              {data.to}
            </div>
          </Tooltip>
        )}
      </div>
    </Box>
  )
}

export default ContactInfo
