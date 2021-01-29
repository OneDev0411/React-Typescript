import styled from 'styled-components'
import React from 'react'
import Flex from 'styled-flex-component'

import { Button, createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      marginLeft: '0.5em'
    }
  })
)

const FooterContainer = styled(Flex)`
  width: 100%;
`
const TagsOverlayFooter = ({
  tagsLength,
  onSubmit,
  closeOverlay,
  isSubmitting
}) => {
  const classes = useStyles()

  return (
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
          data-tour-id="save-tags-button"
          className={classes.button}
          onClick={onSubmit}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </Flex>
    </FooterContainer>
  )
}

export default TagsOverlayFooter
