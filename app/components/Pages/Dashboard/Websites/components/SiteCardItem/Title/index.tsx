import React, {
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useImperativeHandle,
  RefObject,
  forwardRef
} from 'react'

import { TextField, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import useAsync from 'hooks/use-async'
import updateWebsite from 'models/website/update-website'

const useStyles = makeStyles(() =>
  createStyles({
    input: {
      padding: 0
    }
  })
)

export interface TitleRef {
  edit(): void
}

interface Props {
  websiteId: UUID
  initialValue: string
  titleRef?: RefObject<TitleRef>
}

function SiteTitle(props: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [title, setTitle] = useState<string>(props.initialValue)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const classes = useStyles()
  const { isLoading: isWorking, run } = useAsync()

  const toggleEditing = () => {
    setIsEditing(!isEditing)

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select()
      }
    }, 100)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false)

      if (inputRef.current) {
        const value = inputRef.current.value

        run(async () => updateWebsite(props.websiteId, { title: value }))
      }
    }
  }

  useImperativeHandle(props.titleRef, () => ({
    edit: toggleEditing
  }))

  return (
    <>
      {isEditing || isWorking ? (
        <TextField
          inputRef={inputRef}
          label="Site Title"
          defaultValue={title}
          className={classes.input}
          onBlur={toggleEditing}
          onKeyPress={handleKeyPress}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          disabled={isWorking}
        />
      ) : (
        <Typography variant="subtitle2" onClick={toggleEditing}>
          {title || 'No Title'}
        </Typography>
      )}
    </>
  )
}

export default forwardRef((props: Props, ref: RefObject<TitleRef>) => (
  <SiteTitle {...props} titleRef={ref} />
))
