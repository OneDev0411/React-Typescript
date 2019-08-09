import React from 'react'
import { Button, Tooltip } from '@material-ui/core'

import PageHeader from 'components/PageHeader'
import { CloseButton } from 'components/Button/CloseButton'
import { Divider } from 'components/Divider'

import { brandBackground } from 'views/utils/colors'

import Field from './Field'
import { Container } from './styled'

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
    <PageHeader
      isFlat
      style={{
        alignItems: 'flex-start',
        width: '100%',
        margin: 0,
        padding: '1.5em',
        background: brandBackground
      }}
    >
      <PageHeader.Title showBackButton={false}>
        <Container>
          <Field
            variant="h5"
            name="name"
            value={name}
            disabled={disableEdit}
            onChange={value => onChange({ name: value })}
          />
          <Field
            variant="subtitle1"
            name="description"
            value={description}
            disabled={disableEdit}
            onChange={value => onChange({ description: value })}
          />
        </Container>
      </PageHeader.Title>
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
          defaultBackUrl="/dashboard/flows"
        />
      </PageHeader.Menu>
    </PageHeader>
  )
}
