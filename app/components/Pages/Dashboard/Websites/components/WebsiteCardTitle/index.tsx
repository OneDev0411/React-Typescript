import React, {
  memo,
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
  useCallback
} from 'react'

import { useSelector } from 'react-redux'

import { Typography, TextField, Box } from '@material-ui/core'

import useAsync from 'hooks/use-async'

import { selectUserId } from 'selectors/user'

import updateWebsite from 'models/website/update-website'

import useWebsiteListActions from '../WebsiteListProvider/use-website-list-actions'

interface WebsiteCardTitleProps {
  title: string
  websiteId: UUID
}

function WebsiteCardTitle({
  title: initialTitle,
  websiteId
}: WebsiteCardTitleProps) {
  const [title, setTitle] = useState(initialTitle || 'No Title')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { updateItem } = useWebsiteListActions()
  const userId = useSelector(selectUserId)
  const [editable, setEditable] = useState(false)
  const { isLoading: isSaving, run } = useAsync()
  const handleEditStart = useCallback(() => setEditable(true), [])
  const handleEditEnd = useCallback(() => setEditable(false), [])

  useEffect(() => {
    inputRef.current?.select()
  }, [editable])

  const handleSave = () => {
    if (initialTitle !== title) {
      run(async () => updateWebsite(userId, websiteId, { title })).then(() => {
        updateItem(websiteId, { title })
      })
    }

    handleEditEnd()
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value)

  return (
    <Box marginTop={1}>
      {editable || isSaving ? (
        <TextField
          inputRef={inputRef}
          label="Site Title"
          value={title}
          onBlur={handleSave}
          onKeyPress={handleKeyPress}
          onChange={handleChange}
          disabled={isSaving}
        />
      ) : (
        <Typography variant="subtitle2" onClick={handleEditStart}>
          {title}
        </Typography>
      )}
    </Box>
  )
}

export default memo(WebsiteCardTitle)
