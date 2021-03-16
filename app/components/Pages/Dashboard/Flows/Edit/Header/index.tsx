import React from 'react'
import {
  Button,
  IconButton,
  Tooltip,
  Box,
  makeStyles,
  Theme
} from '@material-ui/core'

import { mdiClose } from '@mdi/js'

import { goTo } from 'utils/go-to'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { nameValidate, descriptionValidate } from './helpers'
import Field from './Field'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    },
    titleContainer: {
      width: 0,
      flexGrow: 1,
      marginRight: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column'
    },
    duplicateBtn: {
      marginRight: theme.spacing(1)
    }
  }),
  { name: 'FlowHeader' }
)

interface Props {
  disableEdit?: boolean
  name: string
  description: string
  onChange: (data: { name?: string; description?: string }) => Promise<any>
  onDuplicateClick: () => void
}

export default function Header({
  disableEdit,
  name,
  description,
  onChange,
  onDuplicateClick
}: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      <Box className={classes.titleContainer}>
        <Field
          variant="h6"
          name="name"
          value={name}
          disabled={disableEdit}
          validate={nameValidate}
          onChange={value => onChange({ name: value })}
        />
        <Field
          variant="body2"
          name="description"
          value={description}
          disabled={disableEdit}
          validate={descriptionValidate}
          onChange={value => onChange({ description: value })}
        />
      </Box>
      <Box>
        <Tooltip title="Duplicate this Flow">
          <Button
            variant="outlined"
            size="small"
            className={classes.duplicateBtn}
            onClick={onDuplicateClick}
          >
            Duplicate
          </Button>
        </Tooltip>
        <IconButton
          size="small"
          onClick={() => goTo('/dashboard/marketing/flows')}
        >
          <SvgIcon path={mdiClose} />
        </IconButton>
      </Box>
    </Box>
  )
}
