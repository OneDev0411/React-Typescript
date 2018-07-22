import React, { Fragment } from 'react'
import ContactStage from '../../../../../../views/components/ContactStage'

const MergeContacts = ({ selectedRows }) => (
  <Fragment>
    {selectedRows.length > 0 && (
      <ContactStage
        fullWidth={false}
        defaultSelectedItem={{ label: 'Change Stage', value: 'Change Stage' }}
        style={{
          borderRadius: '3px',
          fontSize: '13px',
          fontWeight: '600',
          letterSpacing: '0.5px',
          color: '#2196f3',
          backgroundColor: '#ffffff',
          border: 'solid 1px #e0e0e0'
        }}
        buttonStyle={{
          paddingLeft: '15px',
          paddingRight: '8px'
        }}
        contacts={selectedRows}
      />
    )}
  </Fragment>
)

export default MergeContacts
