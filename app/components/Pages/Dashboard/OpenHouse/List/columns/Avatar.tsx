import React from 'react'
import { useTheme } from '@material-ui/styles'
import { Avatar, makeStyles, createStyles, Theme } from '@material-ui/core'

import IconHome from 'components/SvgIcons/Home/HomeIcon'

interface Props {
  listings: ICRMTaskAssociation<CRMTaskAssociationType>[]
}

const useAvatarStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      colorDefault: {
        backgroundColor: theme.palette.divider,
        color: theme.palette.text.primary
      }
    }),
  { name: 'MuiAvatar' }
)

export default function Photo({ listings }: Props) {
  useAvatarStyles()

  const theme = useTheme<Theme>()

  const avatar = listings[0] ? listings[0].listing.gallery_image_urls[0] : null

  return (
    <Avatar alt="" src={avatar}>
      <IconHome size="small" fillColor={theme.palette.tertiary.dark} />
    </Avatar>
  )
}
