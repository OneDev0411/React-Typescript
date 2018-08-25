import React, { Fragment } from 'react'
import ContactStage from '../../../../../../views/components/ContactStage'

const MergeContacts = ({ selectedRows, resetSelectedRows }) => (
  <Fragment>
    {selectedRows.length > 0 && (
      <ContactStage
        buttonSize="small"
        contacts={selectedRows}
        defaultSelectedItem={{ label: 'Change Stage', value: 'Change Stage' }}
        resetSelectedRows={resetSelectedRows}
      />
    )}
  </Fragment>
)

export default MergeContacts
