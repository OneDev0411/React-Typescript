import React from 'react'
import { Box, Button, IconButton } from '@material-ui/core'

import { mdiTrashCanOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useCommonStyles } from '../styles'

interface Props {
  step: Nullable<IBrandFlowStep>
  isSubmiting: boolean
  onDelete?: (data: IBrandFlowStep) => Promise<any>
  onCancel: () => void
}

export const ActionFooter = ({
  step,
  isSubmiting,
  onCancel,
  onDelete
}: Props) => {
  const classes = useCommonStyles()

  const handleDelete = async event => {
    event.stopPropagation()
    step && onDelete && onDelete(step)
  }

  const handleCancel = event => {
    event.stopPropagation()
    onCancel()
  }

  return (
    <Box className={classes.footer}>
      {step && onDelete && (
        <Box mr={2}>
          <IconButton
            disabled={isSubmiting}
            onClick={handleDelete}
            size="small"
          >
            <SvgIcon path={mdiTrashCanOutline} />
          </IconButton>
        </Box>
      )}
      <Box mr={1}>
        <Button
          variant="outlined"
          disabled={isSubmiting}
          onClick={handleCancel}
          size="small"
        >
          Cancel
        </Button>
      </Box>
      <Button
        variant="contained"
        color="secondary"
        disabled={isSubmiting}
        type="submit"
        size="small"
      >
        {isSubmiting ? 'Saving' : 'Save'}
      </Button>
    </Box>
  )
}
