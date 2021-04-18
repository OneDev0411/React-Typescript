import React from 'react'
import { withRouter } from 'react-router'

import ShareInstance from 'components/InstantMarketing/adapters/ShareInstance'
import GeneralFlow from 'components/InstantMarketing/adapters/General'
import ContactFlow from 'components/InstantMarketing/adapters/SendContactCard'
import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'
import PublishWebsiteFlow from 'components/InstantMarketing/adapters/PublishWebsite'

import {
  convertToTemplate,
  getMedium,
  getTemplateType
} from 'utils/marketing-center/helpers'

import getTemplateObject from 'components/InstantMarketing/helpers/get-template-object'

import { SAVED_TEMPLATE_VARIANT } from '../InstantMarketing/Builder/AddToMarketingCenter/constants'

const HOLIDAY_TYPES = [
  'BackToSchool',
  'ChineseNewYear',
  'Christmas',
  'ColumbusDay',
  'DaylightSaving',
  'Diwali',
  'Easter',
  'FathersDay',
  'FourthOfJuly',
  'Halloween',
  'Hanukkah',
  'Kwanzaa',
  'LaborDay',
  'MemorialDay',
  'MLKDay',
  'MothersDay',
  'NewYear',
  'OtherHoliday',
  'Passover',
  'PatriotsDay',
  'RoshHashanah',
  'September11',
  'StPatrick',
  'Thanksgiving',
  'Valentines',
  'VeteransDay',
  'WomansDay'
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

const WEBSITE_FLOW_TYPES = ['Listing', 'Agent']

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

  if (WEBSITE_FLOW_TYPES.includes(templateType) && medium === 'Website') {
    return (
      <PublishWebsiteFlow
        {...sharedProps}
        templateType={templateType}
        onFinish={sharedProps.handleTrigger}
      />
    )
  }

  return <ListingFlow {...sharedProps} hasExternalTrigger />
}

export default withRouter(TemplateAction)
