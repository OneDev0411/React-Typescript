import React from 'react'

import ShareInstance from 'components/InstantMarketing/adapters/ShareInstance'
import GeneralFlow from 'components/InstantMarketing/adapters/General'
import ContactFlow from 'components/InstantMarketing/adapters/SendContactCard'
import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'

const GENERAL_FLOW_TYPES = [
  'Brand',
  'Christmas,NewYear,Valentines,StPatrick,Easter,OtherHoliday',
  'NewAgent'
]

function TemplateAction(props) {
  const sharedProps = {
    mediums: props.medium,
    selectedTemplate: props.selectedTemplate,
    isTriggered: props.isTriggered,
    handleTrigger: () => props.setTriggered(false)
  }

  if (props.type === 'history') {
    return (
      <ShareInstance
        {...sharedProps}
        hasExternalTrigger
        instance={props.selectedTemplate}
      />
    )
  }

  if (props.type === 'Birthday') {
    return <ContactFlow {...sharedProps} />
  }

  if (GENERAL_FLOW_TYPES.includes(props.type)) {
    return (
      <GeneralFlow
        {...sharedProps}
        hasExternalTrigger
        types={props.type.split(',')}
      />
    )
  }

  return <ListingFlow {...sharedProps} hasExternalTrigger />
}

export default TemplateAction
