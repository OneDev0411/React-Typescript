import { useRef } from 'react'

import { Button, makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { selectUserUnsafe } from '@app/selectors/user'
import { ReminderDialog } from '@app/views/components/ReminderDialog'

import { SAVED_SEARCH_HINT_DISMISSED_SETTINGS_KEY } from '../../../constants'

const useStyles = makeStyles(
  theme => ({
    saveButton: {
      padding: theme.spacing(1, 2)
    },
    popup: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
      zIndex: theme.zIndex.modal
    },
    container: {
      padding: theme.spacing(2),
      width: '450px'
    },
    icon: {
      width: '100%',
      display: 'inline-block'
    },
    title: {
      marginBottom: theme.spacing(2)
    },
    gotItButton: {
      marginTop: theme.spacing(1)
    }
  }),
  { name: 'PropertiesSaveSearchButton' }
)

interface Props {
  isLoading: boolean
  onClick: () => void
}

export function SaveSearchButton({ isLoading, onClick }: Props) {
  const classes = useStyles()
  const buttonRef = useRef<Nullable<HTMLButtonElement>>(null)
  const user = useSelector(selectUserUnsafe)

  return (
    <>
      {user && (
        <>
          <Button
            className={classes.saveButton}
            size="small"
            variant="contained"
            color="primary"
            disabled={isLoading}
            onClick={onClick}
            ref={buttonRef}
          >
            Save Search
          </Button>
          {!isLoading && (
            <ReminderDialog
              userSettingsKey={SAVED_SEARCH_HINT_DISMISSED_SETTINGS_KEY}
              anchorEl={buttonRef.current}
              title="Save this search and be the first to know about new listings"
            />
          )}
        </>
      )}
    </>
  )
}
