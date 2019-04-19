import styled from 'styled-components'
import React from 'react'
import Flex from 'styled-flex-component'

import ActionButton from 'components/Button/ActionButton'

const FooterContainer = styled(Flex)`
  width: 100%;
`

const TagsOverlayFooter = ({
  tagsLength,
  onSubmit,
  closeOverlay,
  isSubmitting
}) => (
  <FooterContainer alignCenter justifyBetween>
    {`${tagsLength} tags selected`}
    <Flex center>
      <ActionButton appearance="outline" onClick={closeOverlay}>
        Cancel
      </ActionButton>
      <ActionButton style={{ marginLeft: '0.5em' }} onClick={onSubmit}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </ActionButton>
    </Flex>
  </FooterContainer>
)

export default TagsOverlayFooter
