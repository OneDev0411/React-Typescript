import React from 'react'

import ShareInstance from 'components/InstantMarketing/adapters/ShareInstance'
import GeneralFlow from 'components/InstantMarketing/adapters/General'
import ContactFlow from 'components/InstantMarketing/adapters/SendContactCard'
import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'

import { getTemplateType, getMedium, convertToTemplate } from './helpers'

const HOLIDAY_TYPES = [
  'Christmas',
  'NewYear',
  'Valentines',
  'StPatrick',
  'Easter',
  'OtherHoliday'
]
const GENERAL_FLOW_TYPES = [
  'Brand',
  'NewAgent',
  HOLIDAY_TYPES.join(','),
  ...HOLIDAY_TYPES
]

function TemplateAction(props) {
  const { isEdit } = props

  const sharedProps = {
    mediums: getMedium(props),
    selectedTemplate: props.selectedTemplate,
    isTriggered: props.isTriggered,
    isEdit,
    handleTrigger: () => {
      props.setTriggered(false)
      props.setEditActionTriggered(false)
    }
  }

  if (isEdit && !props.isTriggered) {
    return null
  }

  if (!isEdit && props.type === 'history') {
    return (
      <ShareInstance
        {...sharedProps}
        hasExternalTrigger
        instance={props.selectedTemplate}
      />
    )
  }

  const templateType = getTemplateType(props.type, props.selectedTemplate)

  sharedProps.selectedTemplate = convertToTemplate(props.selectedTemplate)

  if (templateType === 'Birthday') {
    return <ContactFlow {...sharedProps} />
  }

  if (GENERAL_FLOW_TYPES.includes(templateType)) {
    return (
      <GeneralFlow
        {...sharedProps}
        hasExternalTrigger
        types={templateType.split(',')}
      />
    )
  }

  return <ListingFlow {...sharedProps} hasExternalTrigger />
}

export default TemplateAction
