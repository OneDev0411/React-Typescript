import { useRef, useState } from 'react'

import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  makeStyles,
  Paper,
  Popper,
  Typography
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import { selectUserUnsafe } from '@app/selectors/user'
import { setUserSetting } from '@app/store_actions/user/set-setting'
import { getUserSettingsInActiveTeam } from '@app/utils/user-teams'

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
  const dispatch = useDispatch()

  const [dontShow, setDontShow] = useState(false)
  const [isOpenHint, setIsOpenHint] = useState(
    user
      ? !getUserSettingsInActiveTeam(
          user,
          SAVED_SEARCH_HINT_DISMISSED_SETTINGS_KEY
        )
      : false
  )

  const onClickGotIt = () => {
    if (dontShow) {
      dispatch(setUserSetting(SAVED_SEARCH_HINT_DISMISSED_SETTINGS_KEY, true))
    }

    setIsOpenHint(false)
  }

  const handleDontShowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDontShow(event.target.checked)
  }

  return (
    <>
      {user && (
        <>
          <Button
            className={classes.saveButton}
            size="medium"
            variant="contained"
            color="primary"
            disabled={isLoading}
            onClick={onClick}
            ref={buttonRef}
          >
            Save Search
          </Button>
          {!isLoading && (
            <Popper
              id="saveSearchButtonPopOver"
              open={isOpenHint}
              anchorEl={buttonRef.current}
              placement="bottom"
              className={classes.popup}
              modifiers={{
                arrow: {
                  enabled: true
                }
              }}
            >
              <Paper elevation={4}>
                <Grid
                  className={classes.container}
                  container
                  direction="row"
                  spacing={3}
                >
                  <Grid
                    item
                    xs={3}
                    container
                    justifyContent="center"
                    alignItems="flex-start"
                  >
                    <img
                      className={classes.icon}
                      src="/static/images/bell/bell.gif"
                      alt="Save Search"
                    />
                  </Grid>
                  <Grid item xs={9} container direction="column">
                    <Typography className={classes.title} variant="h6">
                      Save this search and be the first to know about new
                      listings
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          color="primary"
                          checked={dontShow}
                          onChange={handleDontShowChange}
                          name="dont_show"
                        />
                      }
                      label="Don't show me this message again"
                    />
                    <Button
                      className={classes.gotItButton}
                      variant="contained"
                      color="primary"
                      size="medium"
                      onClick={onClickGotIt}
                    >
                      Got it!
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Popper>
          )}
        </>
      )}
    </>
  )
}
