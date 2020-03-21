import React from 'react'
import { IconButton, createStyles, makeStyles, Theme } from '@material-ui/core'

import IconDelete from 'components/SvgIcons/Trash/TrashIcon'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import { ContextField } from '../../types'

interface Props {
  value: unknown
  field: ContextField
  deal: IDeal
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      '& svg path': {
        fill: theme.palette.common.black
      },
      '&:hover svg path': {
        fill: theme.palette.error.main
      }
    }
  })
)

export function DeleteButton(props: Props) {
  const iconClassess = useIconStyles()
  const classes = useStyles()

  const hasValue = props.value || props.value === 0
  const isRequired = props.field.mandatory && !props.deal.is_draft

  if (isRequired || !hasValue) {
    return null
  }

  return (
    <IconButton size="small" className={classes.button} onClick={props.onClick}>
      <IconDelete className={iconClassess.small} />
    </IconButton>
  )
}
