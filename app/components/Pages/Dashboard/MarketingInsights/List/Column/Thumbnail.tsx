import React from 'react'
import { Avatar, Theme, makeStyles, createStyles } from '@material-ui/core'

import { mdiEmailOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 50,
      height: 50,
      backgroundColor: theme.palette.grey['200'],
      '& svg': {
        color: theme.palette.grey['500']
      }
    }
  })
)

interface Props {
  data: IEmailCampaign
}

function ThumbnailColumn({ data }: Props) {
  const classes = useStyles()
  const imageUrl: string | undefined = data.template
    ? data.template.file.preview_url
    : undefined

  return (
    <Avatar src={imageUrl} className={classes.root}>
      <SvgIcon path={mdiEmailOutline} />
    </Avatar>
  )
}

export default ThumbnailColumn
