import { Box } from '@material-ui/core'
import { connect } from 'react-redux'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import Filters from 'components/Grid/Filters'
import { OperatorAndOperandFilter } from 'components/Grid/Filters/FilterTypes/OparatorAndOperand'
import { SimpleList } from 'components/Grid/Filters/FilterTypes/SimpleList'
import SaveSegment from 'components/Grid/SavedSegments/Create'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'
import { selectTags } from 'reducers/contacts/tags'

import { FLOW_FILTER_ID, OPEN_HOUSE_FILTER_ID, ORIGINS } from '../constants'
import { getPredefinedContactLists } from '../utils/get-predefined-contact-lists'

import createFiltersFromSegment from './helpers/create-filters-from-segment'
import createSegmentFromFilters from './helpers/create-segment-from-filters'
import getFlows from './helpers/get-flows'
import getOpenHouseEvents from './helpers/get-open-house-events'
import getUniqTags from './helpers/get-uniq-tags'

function ContactFilters(props) {
  const activeBrandId = useActiveBrandId()

  const getConfig = () => {
    const { attributeDefs, tags } = props

    const tagDefinition = selectDefinitionByName(attributeDefs, 'tag')
    const sourceDefinition = selectDefinitionByName(
      attributeDefs,
      'source_type'
    )

    return [
      {
        id: tagDefinition.id,
        label: 'Tag',
        renderer: props => (
          <OperatorAndOperandFilter {...props} options={getUniqTags(tags)} />
        ),
        tooltip:
          // eslint-disable-next-line max-len
          'A group a person belongs to, based on a tag you’ve manually applied to them.'
      },
      {
        id: OPEN_HOUSE_FILTER_ID,
        label: 'Open House',
        renderer: props => (
          <SimpleList {...props} getOptions={getOpenHouseEvents} />
        ),
        tooltip: 'Contacts invited to a specific Open House'
      },
      {
        id: FLOW_FILTER_ID,
        label: 'Flow',
        renderer: props => (
          <SimpleList {...props} getOptions={() => getFlows(activeBrandId)} />
        ),
        tooltip: 'Contacts who are active in a specific Flow'
      },
      {
        id: sourceDefinition.id,
        label: 'Origin',
        renderer: props => (
          <OperatorAndOperandFilter {...props} options={ORIGINS} />
        ),
        tooltip: 'Source type'
      }
    ]
  }

  return (
    <Box display="flex" alignItems="center">
      {props?.show && (
        <Filters
          name="contacts"
          plugins={['segments']}
          config={getConfig()}
          createFiltersFromSegment={createFiltersFromSegment}
          getPredefinedLists={getPredefinedContactLists}
          onChange={() => props.onFilterChange()}
          disableConditionOperators={props.disableConditionOperators}
        >
          <SaveSegment
            createSegmentFromFilters={createSegmentFromFilters(
              props.conditionOperator
            )}
          />
        </Filters>
      )}
    </Box>
  )
}

function mapStateToProps({ contacts }) {
  const { tags, attributeDefs } = contacts

  return {
    tags: selectTags(tags),
    conditionOperator: contacts.filterSegments.conditionOperator,
    attributeDefs
  }
}

export default connect(mapStateToProps)(ContactFilters)
