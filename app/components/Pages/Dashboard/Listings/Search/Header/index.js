import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'

import PageLayout from 'components/GlobalPageLayout'

import FilterButton from '../../../../../../views/components/Button/DropButton'

import Filters from '../components/Filters'
import Autocomplete from '../components/Autocomplete'

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      height: '6em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: theme.spacing(0, 1.5)
    }
  })
)

export function Header(props) {
  const classes = useStyles(props)
  const {
    isFetching,
    filtersIsOpen,
    onClickFilter,
    isSideMenuOpen,
    activeView,
    isWidget
  } = props

  return (
    <Box className={classes.container}>
      <PageLayout.Header>
        <Box display="flex" alignItems="center">
          <Autocomplete activeView={activeView} />
          <FilterButton
            style={{ marginLeft: '0.5em' }}
            onClick={onClickFilter}
            isOpen={filtersIsOpen}
            disabled={isFetching}
            text="Filter Search"
            size="large"
            appearance="outline"
          />
          <Filters
            isOpen={filtersIsOpen}
            isSubmitting={isFetching}
            isSideMenuOpen={isSideMenuOpen}
            handleClose={onClickFilter}
          />
          {!isWidget && props.user && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={isFetching}
              onClick={props.saveSearchHandler}
              style={{ marginLeft: '0.5em' }}
            >
              Save Search
            </Button>
          )}
        </Box>
      </PageLayout.Header>
    </Box>
  )
}
