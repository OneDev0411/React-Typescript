import React from 'react'

import { createStyles, makeStyles } from '@material-ui/core'

import { mdiTrashCanOutline } from '@mdi/js'

import Icon from '@mdi/react'

import ActionButton from '../Button/ActionButton'
import Tooltip from '../tooltip'
import IconButton from '../Button/IconButton'

interface Props {
  handleEdit: () => void
  handleDelete?: () => void
  editButtonText?: string
}

const useStyles = makeStyles(
  () =>
    createStyles({
      iconButton: {
        padding: '0 0.5rem!important',
        backgroundColor: 'rgba(0, 0, 0, 0.55)!important',

        '& svg': {
          color: '#fff!important'
        },

        '&:hover': {
          background: '#000'
        }
      }
    }),
  { name: 'TemplateInstanceCardActions' }
)

export default function TemplateCardActions({
  editButtonText = 'Customize',
  handleEdit,
  handleDelete
}: Props) {
  const classes = useStyles()

  return (
    <>
      <div style={handleDelete ? {} : { width: '100%' }}>
        <ActionButton
          onClick={() => {
            if (handleEdit) {
              handleEdit()
            }
          }}
          isBlock
          data-test="marketing-customize-button"
        >
          {editButtonText}
        </ActionButton>
      </div>
      {handleDelete && (
        <div>
          <Tooltip caption="Delete">
            <IconButton
              iconSize="large"
              className={classes.iconButton}
              onClick={() => {
                handleDelete()
              }}
            >
              <Icon path={mdiTrashCanOutline} size={1} />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </>
  )
}
