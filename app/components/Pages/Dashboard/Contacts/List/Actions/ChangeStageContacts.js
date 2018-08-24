import React, { Fragment } from 'react'
import ContactStage from '../../../../../../views/components/ContactStage'

const MergeContacts = ({ selectedRows }) => (
  <Fragment>
    {selectedRows.length > 0 && (
      <ContactStage
        buttonSize="small"
        contacts={selectedRows}
        defaultSelectedItem={{ label: 'Change Stage', value: 'Change Stage' }}
      />
    )}
  </Fragment>
)

export default MergeContacts
