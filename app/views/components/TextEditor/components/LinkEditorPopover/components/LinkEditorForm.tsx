import { Box, Button, Grid, TextField } from '@material-ui/core'

import * as React from 'react'
import { useRef } from 'react'

import { PaperProps } from '@material-ui/core/Paper'

import { useInViewportAutofocus } from 'hooks/use-in-viewport-autofocus'

import { PopoverContainer } from '../styled'
import { normalizeUrl } from '../utils'

interface Props extends PaperProps {
  onApply: (text: string, link: string) => void
  text: string
  setText: (url: string) => void
  url: string
  setUrl: (url: string) => void
}

export function LinkEditorForm({
  onApply,
  text,
  setText,
  url,
  setUrl,
  ...rest
}: Props) {
  /*
      After a couple of back and forth, I decided not to use final form here
      because:
        - Fairly simple validation logic which is not subject to change in future
        - Need for control over the values from outside the form which will be hacky with final form
        - Don't want to show validation status and message an fields.
        https://google.com
      */

  const handleSubmit = event => {
    event.stopPropagation()
    event.preventDefault()

    if (url) {
      const normalizedUrl = normalizeUrl(url)

      onApply(text || normalizedUrl, normalizedUrl)
    }
  }

  const urlInputRef = useRef<HTMLInputElement>(null)

  // This hack is used instead of simply putting an autofocus prop on the
  // url input, because of this issue:
  // https://github.com/mui-org/material-ui/issues/16740
  useInViewportAutofocus(urlInputRef, 150)

  return (
    <PopoverContainer elevation={10} {...rest}>
      <form onSubmit={handleSubmit} noValidate>
        <Box p={2}>
          <Grid container wrap="nowrap" alignItems="flex-end">
            <Grid container direction="column">
              <TextField
                label="Text"
                value={text}
                onChange={event => setText(event.target.value)}
                margin="dense"
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                value={url}
                onChange={event => setUrl(event.target.value)}
                inputRef={urlInputRef}
                placeholder="Paste a link"
                InputLabelProps={{
                  shrink: true
                }}
                required
                label="Link"
                margin="dense"
                variant="outlined"
              />
            </Grid>
            <Box marginLeft={2} marginBottom={0.6}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={!url}
              >
                Apply
              </Button>
            </Box>
          </Grid>
        </Box>
      </form>
    </PopoverContainer>
  )
}
