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
  titleRef?: RefObject<TitleRef>
}

function SiteTitle(props: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [title, setTitle] = useState<string>('Your Site Logo Goes Here')
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const classes = useStyles()

  const toggleEditing = () => {
    setIsEditing(!isEditing)

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select()
      }
    }, 100)
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
    }
  }

  useImperativeHandle(props.titleRef, () => ({
    edit: toggleEditing
  }))

  return (
    <>
      {isEditing ? (
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
