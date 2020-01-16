import React from 'react'

import Button from '../../../../views/components/Button/ActionButton'

interface Props {
  color: string
  isDisabled: boolean
  text: string
}

export default function SubmitButton(props: Props) {
  return (
    <Button
      type="submit"
      isBlock
      disabled={props.isDisabled}
      style={{ marginBottom: '2em' }}
      brandColor={props.color}
    >
      {props.text}
    </Button>
  )
}
