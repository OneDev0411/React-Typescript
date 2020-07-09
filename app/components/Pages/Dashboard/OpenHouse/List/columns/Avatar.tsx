import React from 'react'
import { Avatar, makeStyles, createStyles, Theme } from '@material-ui/core'

import { mdiHomeOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  listings: ICRMTaskAssociation<CRMTaskAssociationType>[]
}

const useAvatarStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      colorDefault: {
        backgroundColor: theme.palette.grey['200'],
        color: theme.palette.text.primary,
        '& svg': {
          color: theme.palette.grey['500']
        }
      }
    }),
  { name: 'MuiAvatar' }
)

export default function Photo({ listings }: Props) {
  useAvatarStyles()

  const avatar = listings[0] ? listings[0].listing.gallery_image_urls[0] : null

  return (
    <Avatar alt="" src={avatar}>
      <SvgIcon path={mdiHomeOutline} />
    </Avatar>
  )
}
