import React from 'react'
import { Chip, ChipProps, Theme, Typography, Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { mdiEyeOutline, mdiCursorDefaultClickOutline } from '@mdi/js'
import pluralize from 'pluralize'
import classNames from 'classnames'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { Status } from './types'

const useStyles = makeStyles((theme: Theme) => ({
  label: {
    display: 'inline-flex',
    alignItems: 'center'
  },
  space: {
    width: theme.spacing(2)
  }
}))

interface Props extends ChipProps {
  status: Status
}

export default function CampaignStatus({ status, ...others }: Props) {
  const classes = useStyles()

  return (
    <Chip
      variant="outlined"
      size="small"
      {...others}
      classes={{
        ...others.classes,
        label: classNames(classes.label, others.classes?.label)
      }}
      label={
        <>
          {status.opened !== undefined && (
            <Tooltip
              title={`Email is opened ${pluralize(
                'time',
                status.opened,
                true
              )}`}
            >
              <span className={classes.label}>
                <SvgIcon path={mdiEyeOutline} size={muiIconSizes.small} />
                <Typography variant="caption">&nbsp;{status.opened}</Typography>
              </span>
            </Tooltip>
          )}
          {status.opened !== undefined && status.clicked !== undefined && (
            <div className={classes.space} />
          )}
          {status.clicked !== undefined && (
            <Tooltip
              title={`Email is clicked ${pluralize(
                'time',
                status.clicked,
                true
              )}`}
            >
              <span className={classes.label}>
                <SvgIcon
                  path={mdiCursorDefaultClickOutline}
                  size={muiIconSizes.small}
                />
                <Typography variant="caption">
                  &nbsp;{status.clicked}
                </Typography>
              </span>
            </Tooltip>
          )}
        </>
      }
    />
  )
}
