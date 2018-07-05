import React from 'react'
import ActionButton from '../../../../../../../views/components/Button/ActionButton'
import Flex from 'styled-flex-component'
import CancelButton from '../../../../../../../views/components/Button/CancelButton'

const FooterContainer = Flex.extend`
  width: 100%;
`

const TagsOverlay = ({ tagsLength, onSubmit, closeOverlay, isSubmitting }) => (
  <FooterContainer alignCenter justifyBetween>
    {`${tagsLength} tags selected`}
    <Flex center>
      <CancelButton onClick={closeOverlay}>Cancel</CancelButton>
      <ActionButton
        type="submit"
        style={{ marginLeft: '0.5em' }}
        onClick={onSubmit}
      >
        {isSubmitting ? 'saving...' : 'Save'}
      </ActionButton>
    </Flex>
  </FooterContainer>
)

export default TagsOverlay
