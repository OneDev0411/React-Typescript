import React from 'react'
import { connect } from 'react-redux'

import Flex from 'styled-flex-component'

import { selectDealEnvelopes } from 'reducers/deals/envelopes'

import { getDocumentEnvelopes } from 'views/utils/deal-files/get-document-envelopes'

import ActionsButton from '../../../../../components/ActionsButton'

import { LabelItem } from '../../../styled'
import { FileContainer, FileRow, FileTitle, FileLink } from '../styled'

class DigitalForm extends React.Component {
  get HasActiveEnvelope() {
    const envelopes = getDocumentEnvelopes(
      this.props.envelopes,
      this.props.task
    )

    if (envelopes.length === 0 || envelopes[0].status === 'Voided') {
      return false
    }

    return true
  }

  render() {
    const { props } = this

    if (!props.task || !props.task.form || this.HasActiveEnvelope) {
      return false
    }

    return (
      <FileContainer>
        <FileRow>
          <Flex alignCenter justifyBetween>
            <FileTitle>
              <FileLink
                size="small"
                className="file-link"
                to={`/dashboard/deals/${props.deal.id}/form-edit/${
                  props.task.id
                }`}
              >
                {props.task.title}
              </FileLink>
            </FileTitle>

            <ActionsButton
              type="document"
              deal={props.deal}
              task={props.task}
              document={props.task}
            />
          </Flex>

          <Flex alignCenter>
            <LabelItem>Base Form</LabelItem>
          </Flex>
        </FileRow>
      </FileContainer>
    )
  }
}

function mapStateToProps({ deals }, props) {
  return {
    envelopes: selectDealEnvelopes(props.deal, deals.envelopes)
  }
}

export default connect(mapStateToProps)(DigitalForm)
