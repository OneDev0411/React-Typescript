import React, { Fragment } from 'react'
import ContactStage from '../../../../../../views/components/ContactStage'

const MergeContacts = ({ selectedRows }) => (
  <Fragment>
    {selectedRows.length > 0 && (
      <ContactStage
        fullWidth
        defaultSelectedItem={{ label: 'Change Stage', value: 'Change Stage' }}
        style={{
          borderRadius: '3px',
          border: '1px solid #000',
          display: 'inline-flex',
          alignItems: 'center'
        }}
        buttonStyle={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '14px',
          height: '30px',
          color: '#000',
          padding: '0 8px',
          fontFamily: 'Barlow, sans-serif'
        }}
        contacts={selectedRows}
      />
    )}
  </Fragment>
)

export default MergeContacts
