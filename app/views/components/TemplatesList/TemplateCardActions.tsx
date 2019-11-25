import React from 'react'

import ActionButton from '../Button/ActionButton'

interface Props {
  handleCustomize: () => void
}

export function TemplateCardActions(props: Props) {
  return (
    <>
      <div style={{ width: '100%' }}>
        <ActionButton
          onClick={() => {
            props.handleCustomize()
          }}
          isBlock
          data-test="marketing-customize-button"
        >
          Customize
        </ActionButton>
      </div>
    </>
  )
}
