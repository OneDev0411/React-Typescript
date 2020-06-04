import React from 'react'
import { Button, Tooltip, Box } from '@material-ui/core'

import PageHeader from 'components/PageHeader'
import { CloseButton } from 'components/Button/CloseButton'
import { Divider } from 'components/Divider'

import { brandBackground } from 'views/utils/colors'

import { nameValidate, descriptionValidate } from './helpers'
import Field from './Field'

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
  return (
    <Box
      width="100%"
      padding={3}
      style={{ backgroundColor: brandBackground }}
      display="flex"
      alignItems="flex-start"
    >
      <Box
        width={0}
        flexGrow={1}
        marginRight={3}
        display="flex"
        flexDirection="column"
      >
        <Field
          variant="h5"
          name="name"
          value={name}
          disabled={disableEdit}
          validate={nameValidate}
          onChange={value => onChange({ name: value })}
        />
        <Field
          variant="subtitle1"
          name="description"
          value={description}
          disabled={disableEdit}
          validate={descriptionValidate}
          onChange={value => onChange({ description: value })}
        />
      </Box>
      <PageHeader.Menu>
        <Tooltip title="Duplicate this Flow">
          <Button variant="outlined" onClick={onDuplicateClick}>
            Duplicate
          </Button>
        </Tooltip>
        <Divider vertical height="1.5rem" margin="0 1.5rem" />
        <CloseButton
          isFit
          iconSize="large"
          inverse
          defaultBackUrl="/dashboard/account/flows"
        />
      </PageHeader.Menu>
    </Box>
  )
}
