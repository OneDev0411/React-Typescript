import styled from 'styled-components'
import React from 'react'
import Flex from 'styled-flex-component'

import { Button } from '@material-ui/core'

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
      <Button variant="outlined" onClick={closeOverlay}>
        Cancel
      </Button>
      <Button
        color="secondary"
        variant="contained"
        data-test="save-tags-button"
        style={{ marginLeft: '0.5em' }}
        onClick={onSubmit}
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </Flex>
  </FooterContainer>
)

export default TagsOverlayFooter
