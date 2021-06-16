import React from 'react'
import { Box, Button, makeStyles } from '@material-ui/core'

import { mdiChevronDown } from '@mdi/js'

import GlobalPageLayout from 'components/GlobalPageLayout'
import { BaseDropdown } from 'components/BaseDropdown'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import Filters from '../components/Filters'
import Autocomplete from '../components/Autocomplete'

const useStyles = makeStyles(
  theme => ({
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      [theme.breakpoints.up('md')]: {
        display: 'flex'
      }
    },
    body: {
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        justifyContent: 'flex-end'
      }
    },
    filtersButton: {
      display: 'flex',
      marginTop: theme.spacing(3),
      [theme.breakpoints.up('md')]: {
        marginTop: 0,
        marginLeft: theme.spacing(1)
      }
    }
  }),
  { name: 'MLSSearchHeader' }
)

export function Header(props) {
  const classes = useStyles()
  const { isFetching, activeView } = props

  return (
    <Box className={classes.container}>
      <GlobalPageLayout.Header title="All Properties" isHiddenOnMobile={false}>
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
                <SvgIcon path={mdiChevronDown} />
              </Button>
            )}
            renderMenu={({ close }) => (
              // The <div> wrapper is required since we're putting this element
              // inside a <ClickAwayListener /> component which needs its child
              // component to to be able to hold a ref.
              // Read more:
              // https://material-ui.com/api/click-away-listener
              // <BaseDropdown> component takes care of clickAwayClosing so we don't
              // need to use close arg passed to renderMenu()
              <div>
                <Filters isSubmitting={isFetching} handleClose={close} />
              </div>
            )}
          />
        </Box>
      </GlobalPageLayout.Header>
    </Box>
  )
}
