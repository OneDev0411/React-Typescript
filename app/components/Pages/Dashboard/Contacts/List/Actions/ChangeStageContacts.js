import React, { Fragment } from 'react'
import ContactStage from '../../../../../../views/components/ContactStage'

const MergeContacts = ({ selectedRows, resetSelectedRows }) => (
  <Fragment>
    {selectedRows.length > 0 && (
      <ContactStage
        fullWidth
        defaultSelectedItem={{ label: 'Change Stage', value: 'Change Stage' }}
        style={{
          borderRadius: '3px',
          fontSize: '13px',
          fontWeight: '600',
          letterSpacing: '0.5px',
          color: '#2196f3',
          backgroundColor: '#ffffff',
          border: 'solid 1px #2196f3'
        }}
        buttonStyle={{
          padding: '0 1.5em',
          height: '34px'
        }}
        contacts={selectedRows}
        resetSelectedRows={resetSelectedRows}
      />
    )}
  </Fragment>
)

export default MergeContacts
