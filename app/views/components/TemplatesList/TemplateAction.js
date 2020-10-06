import React from 'react'
import { withRouter } from 'react-router'

import ShareInstance from 'components/InstantMarketing/adapters/ShareInstance'
import GeneralFlow from 'components/InstantMarketing/adapters/General'
import ContactFlow from 'components/InstantMarketing/adapters/SendContactCard'
import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'

import {
  convertToTemplate,
  getMedium,
  getTemplateType
} from 'utils/marketing-center/helpers'

import getTemplateObject from 'components/InstantMarketing/helpers/get-template-object'

import { SAVED_TEMPLATE_VARIANT } from '../InstantMarketing/Builder/AddToMarketingCenter/constants'

const HOLIDAY_TYPES = [
  'Christmas',
  'NewYear',
  'Valentines',
  'StPatrick',
  'Easter',
  'FathersDay',
  'MothersDay',
  'WomansDay',
  'ColombusDay',
  'PatriotsDay',
  'MemorialDay',
  'LaborDay',
  'BackToSchool',
  'Hannukkah',
  'Passover',
  'RoshHashanah',
  'FourthOfJuly',
  'VeteransDay',
  'Thanksgiving',
  'Halloween',
  'MLKDay',
  'ChineseNewYear',
  'Diwaly',
  'Kwanzaa',
  'OtherHoliday'
]

const GENERAL_FLOW_TYPES = [
  'Brand',
  'NewAgent',
  'Newsletter',
  'Layout',
  HOLIDAY_TYPES.join(','),
  ...HOLIDAY_TYPES
]

const CONTACT_FLOW_TYPES = ['WeddingAnniversary']

function TemplateAction(props) {
  const { isEdit } = props
  const medium = getMedium(props)

  const sharedProps = {
    mediums: medium,
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
  const isBirthdaySocial = templateType === 'Birthday' && medium === 'Social'

  sharedProps.selectedTemplate = convertToTemplate(props.selectedTemplate)

  // TODO: Refactor this logic as it's not right and it's fragile!
  // There's a "inputs" (inputs: string[]) key inside the template which we should check it for deciding about the flow!
  // We should check that inputs and use it for showing the proper flow based on template needs.

  if (
    props.selectedTemplate &&
    getTemplateObject(props.selectedTemplate).variant === SAVED_TEMPLATE_VARIANT
  ) {
    return (
      <GeneralFlow
        {...sharedProps}
        hasExternalTrigger
        types={templateType.split(',')}
      />
    )
  }

  if (
    CONTACT_FLOW_TYPES.includes(templateType) ||
    (templateType === 'Birthday' && !isBirthdaySocial)
  ) {
    return <ContactFlow {...sharedProps} />
  }

  if (GENERAL_FLOW_TYPES.includes(templateType) || isBirthdaySocial) {
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

export default withRouter(TemplateAction)
