import React from 'react'

import { Box } from '@material-ui/core'
import { mdiEmailOutline } from '@mdi/js'
import { EditorState } from 'draft-js'

import { StyledTextEditor } from 'components/EditEmailSignature'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  editorState: EditorState
  onChange: (state: EditorState) => void
}

export default function EmailSignatureEditor({ editorState, onChange }: Props) {
  return (
    <>
      <Box mb={0.5} display="flex" justifyContent="center" alignItems="center">
        <SvgIcon path={mdiEmailOutline} />
        <span style={{ marginLeft: '0.5rem' }}>Your email signature</span>
      </Box>
      <StyledTextEditor
        style={{ minHeight: '10rem' }}
        editorState={editorState}
        onChange={onChange}
        placeholder="Type something or copy from your Gmail or Outlook account"
      />
    </>
  )
}
