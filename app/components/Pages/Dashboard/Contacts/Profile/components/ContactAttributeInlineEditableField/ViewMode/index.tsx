import React from 'react'
import { Box, Tooltip, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import classNames from 'classnames'

import StarIcon from 'components/SvgIcons/Star/StarIcon'

import { useIconStyles } from '../../../../../../../../styles/use-icon-styles'

interface Props {
  is_primary?: boolean
  title?: string
  value?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      '&:hover $title': {
        color: theme.palette.text.primary
      }
    },
    leftSide: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: (props: Props) => ({
      color: props.value ? theme.palette.text.primary : theme.palette.text.hint
    }),
    starIcon: {
      fill: theme.palette.text.primary
    },
    value: (props: Props) => ({
      textAlign: 'right',
      color: props.value ? theme.palette.text.primary : theme.palette.text.hint
    })
  })
)

export function ViewMode(props: Props) {
  const classes = useStyles(props)
  const iconClasses = useIconStyles()

  const { title } = props

  return (
    <Box className={classes.container}>
      <Box className={classes.leftSide}>
        <Typography
          variant="body2"
          className={classes.title}
          data-test={`contact-attribute${title ? `-${title}` : ''}`}
        >
          {title}
        </Typography>
        {props.is_primary && (
          <Tooltip title="Primary">
            <StarIcon
              className={classNames(classes.starIcon, iconClasses.leftMargin)}
              style={{
                width: '1rem',
                height: '1rem'
              }}
            />
          </Tooltip>
        )}
      </Box>
      <Typography variant="body2" className={classes.value}>
        {props.value || '-'}
      </Typography>
    </Box>
  )
}
