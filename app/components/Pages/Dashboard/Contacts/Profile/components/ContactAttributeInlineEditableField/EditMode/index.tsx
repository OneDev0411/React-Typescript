import React, { ReactNode } from 'react'

import { noop } from 'utils/helpers'

import { Error } from './Error'
import { Label } from './Label'
import { Title } from './Title'
import { Value } from './Value'

interface Props {
  children: ReactNode
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
  children,
  onChangeValue,
  placeholder = '',
  onEnterKeyPress = noop,
  onChangeLabel = noop,
  onChangePrimary = noop
}: Props) => {
  return (
    <>
      <Title attribute={attribute} onChangePrimary={onChangePrimary} />
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
      {children}
      {error && <Error>{error}</Error>}
    </>
  )
}
