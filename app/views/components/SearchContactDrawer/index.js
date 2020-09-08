import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Button, makeStyles } from '@material-ui/core'

import NewContactDrawer from 'components/CreateContact/NewContactDrawer'

import Drawer from '../OverlayDrawer'
import Body from '../SelectContactModal/components/Body'

const useStyles = makeStyles(
  theme => ({
    createContact: {
      width: '100%',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(-1.5)
    }
  }),
  {
    name: 'SearchContactDrawer'
  }
)

const propTypes = {
  ...Drawer.propTypes,
  defaultSearchFilter: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  headerMenu: PropTypes.element
}

const defaultProps = {
  ...Drawer.defaultProps,
  defaultSearchFilter: ''
}

export function SearchContactDrawer(props) {
  const classes = useStyles()
  const [showCreateContact, setShowCreateContact] = useState(false)

  const toggleShowCreateContact = () => setShowCreateContact(!showCreateContact)

  return (
    <Drawer open={props.isOpen} onClose={props.onClose}>
      <Drawer.Header title={props.title} menu={props.headerMenu} />
      <Drawer.Body>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.createContact}
          onClick={toggleShowCreateContact}
        >
          New Contact
        </Button>
        {showCreateContact && (
          <NewContactDrawer
            isOpen
            onClose={toggleShowCreateContact}
            submitCallback={contact => props.onSelect(contact)}
            showAddAnother={false}
          />
        )}
        <Body
          isDrawer
          handleSelectedItem={props.onSelect}
          defaultSearchFilter={props.defaultSearchFilter}
        />
      </Drawer.Body>
    </Drawer>
  )
}

SearchContactDrawer.propTypes = propTypes
SearchContactDrawer.defaultProps = defaultProps
