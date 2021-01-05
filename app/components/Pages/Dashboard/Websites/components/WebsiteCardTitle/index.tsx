import React, {
  memo,
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ChangeEvent
} from 'react'

import { useSelector } from 'react-redux'

import { Typography, TextField, Box } from '@material-ui/core'

import useAsync from 'hooks/use-async'

import { selectUserId } from 'selectors/user'

import updateWebsite from 'models/website/update-website'

import useWebsiteListInstanceActions from '../WebsiteListInstanceProvider/use-website-list-instance-actions'

interface WebsiteCardTitleProps {
  title: string
  editable: boolean
  onEditStart: () => void
  onEditEnd: () => void
  websiteId: UUID
}

function WebsiteCardTitle({
  title: initialTitle,
  editable,
  onEditStart,
  onEditEnd,
  websiteId
}: WebsiteCardTitleProps) {
  const [title, setTitle] = useState(initialTitle || 'No Title')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { updateWebsiteInstance } = useWebsiteListInstanceActions()
  const userId = useSelector(selectUserId)
  const { isLoading: isSaving, run } = useAsync()

  useEffect(() => {
    inputRef.current?.select()
  }, [editable])

  const handleSave = () => {
    if (initialTitle !== title) {
      run(async () => updateWebsite(userId, websiteId, { title })).then(() => {
        updateWebsiteInstance(websiteId, { title })
      })
    }

    onEditEnd()
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
        <Typography variant="subtitle2" onClick={onEditStart}>
          {title}
        </Typography>
      )}
    </Box>
  )
}

export default memo(WebsiteCardTitle)
