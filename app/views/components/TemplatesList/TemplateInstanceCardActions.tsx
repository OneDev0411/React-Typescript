import React from 'react'

import { createStyles, makeStyles } from '@material-ui/core'

import ActionButton from '../Button/ActionButton'
import Tooltip from '../tooltip'
import IconButton from '../Button/IconButton'
import DeleteIcon from '../SvgIcons/DeleteOutline/IconDeleteOutline'

interface Props {
  handleEdit: () => void
  handleDelete: () => void
}

const useStyles = makeStyles(
  () =>
    createStyles({
      iconButton: {
        padding: '0 0.5rem',
        backgroundColor: 'rgba(0, 0, 0, 0.55)!important',

        '& svg': {
          fill: '#fff!important'
        },

        '&:hover': {
          background: '#000'
        }
      }
    }),
  { name: 'TemplateInstanceCardActions' }
)

export function TemplateInstanceCardActions(props: Props) {
  const classes = useStyles()

  return (
    <>
      <div>
        <ActionButton
          onClick={e => {
            e.stopPropagation()

            if (props.handleEdit) {
              props.handleEdit()
            }
          }}
          isBlock
          data-test="marketing-customize-button"
        >
          Continue
        </ActionButton>
      </div>
      <div>
        <Tooltip caption="Delete">
          <IconButton
            iconSize="large"
            className={classes.iconButton}
            onClick={e => {
              e.stopPropagation()
              props.handleDelete()
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    </>
  )
}
