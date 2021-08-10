import React from 'react'

import { createStyles, makeStyles, Tooltip } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import ActionButton from '../Button/ActionButton'
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
          <Tooltip title="Delete">
            <IconButton
              iconSize="large"
              className={classes.iconButton}
              onClick={() => {
                handleDelete()
              }}
            >
              <SvgIcon path={mdiTrashCanOutline} />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </>
  )
}
