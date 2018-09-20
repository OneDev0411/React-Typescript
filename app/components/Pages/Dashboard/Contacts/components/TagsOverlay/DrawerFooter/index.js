import React from 'react'
import ActionButton from 'components/Button/ActionButton'
import Flex from 'styled-flex-component'

const FooterContainer = Flex.extend`
  width: 100%;
`

const TagsOverlay = ({ tagsLength, onSubmit, closeOverlay, isSubmitting }) => (
  <FooterContainer alignCenter justifyBetween>
    {`${tagsLength} tags selected`}
    <Flex center>
      <ActionButton appearance="outline" onClick={closeOverlay}>
        Cancel
      </ActionButton>
      <ActionButton style={{ marginLeft: '0.5em' }} onClick={onSubmit}>
        {isSubmitting ? 'saving...' : 'Save'}
      </ActionButton>
    </Flex>
  </FooterContainer>
)

export default TagsOverlay
