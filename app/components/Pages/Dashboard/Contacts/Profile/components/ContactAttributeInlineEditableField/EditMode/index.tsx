import React from 'react'

import { Box } from '@material-ui/core'

import { Checkbox } from 'components/Checkbox'
import { noop } from 'utils/helpers'

import { Error } from './Error'
import { Label } from './Label'
import { Title } from './Title'
import { Value } from './Value'

interface Props {
  attribute: IContactAttributeWithDef
  onEnterKeyPress?: () => void
  onChangeLabel?: () => void
  onChangePrimary?: () => void
  onChangeValue: () => void
  placeholder?: string
  error?: string
}

export const EditMode = ({
  error,
  attribute,
  onChangeValue,
  placeholder = '',
  onEnterKeyPress = noop,
  onChangeLabel = noop,
  onChangePrimary = noop
}: Props) => {
  return (
    <>
      <Title attribute={attribute} />
      {attribute.attribute_def.has_label && (
        <Label
          attribute={attribute}
          onChange={onChangeLabel}
          placeholder={placeholder}
        />
      )}
      <Value
        attribute={attribute}
        onChange={onChangeValue}
        placeholder={placeholder}
        handleEnterKey={onEnterKeyPress}
      />
      {!attribute.attribute_def.singular && (
        <Box mt={1}>
          <Checkbox
            // @ts-ignore
            id={attribute.id || attribute.cuid}
            checked={attribute.is_primary || false}
            onChange={onChangePrimary}
          >
            Primary
          </Checkbox>
        </Box>
      )}
      {error && <Error>{error}</Error>}
    </>
  )
}
