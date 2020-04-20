import React from 'react'
import { Box, Button, makeStyles } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'

import GlobalPageLayout from 'components/GlobalPageLayout'
import { BaseDropdown } from 'components/BaseDropdown'
import IconArrowDown from 'views/components/SvgIcons/ArrowDownKeyboard/IconArrowDownKeyboard'

import Filters from '../components/Filters'
import Autocomplete from '../components/Autocomplete'

const useStyles = makeStyles(
  theme => ({
    container: {
      height: theme.spacing(15),
      display: 'flex'
    },
    body: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    filtersButton: {
      marginLeft: theme.spacing(1)
    }
  }),
  { name: 'MLSSearchHeader' }
)

export function Header(props) {
  const classes = useStyles()
  const theme = useTheme()
  const { isFetching, activeView, showGlobalActionsButton } = props

  return (
    <Box className={classes.container}>
      <GlobalPageLayout.Header
        title="All Properties"
        noGlobalActionsButton={!showGlobalActionsButton}
      >
        <Box className={classes.body}>
          <Autocomplete activeView={activeView} />
          <BaseDropdown
            renderDropdownButton={buttonProps => (
              <Button
                className={classes.filtersButton}
                variant="outlined"
                size="large"
                disabled={isFetching}
                {...buttonProps}
              >
                Filters
                <IconArrowDown fillColor={theme.palette.common.black} />
              </Button>
            )}
            renderMenu={({ close }) => (
              <Filters isSubmitting={isFetching} handleClose={close} />
            )}
          />
        </Box>
      </GlobalPageLayout.Header>
    </Box>
  )
}
