import React from 'react'
import { connect } from 'react-redux'

import PageHeader from '../../../../../../views/components/PageHeader'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

import Frame from '../../../../../../views/components/Deals/EmbedFormEdit'

class EditTemplate extends React.Component {
  handleSave = () => {}

  render() {
    const { form } = this.props

    return (
      <div className="c-deal-templates--edit">
        <PageHeader backButton>
          <PageHeader.Title>
            <PageHeader.Heading>{form.name}</PageHeader.Heading>
          </PageHeader.Title>

          <PageHeader.Menu>
            <ActionButton
              style={{ padding: '0.75em' }}
              onClick={this.handleSave}
            >
              Save Template
            </ActionButton>
          </PageHeader.Menu>
        </PageHeader>

        <Frame formId={form.id} frameRef={ref => (this.frame = ref)} />
      </div>
    )
  }
}

function mapStateToProps({ deals }, { params }) {
  return {
    form: deals.forms ? deals.forms[params.id] : null
  }
}

export default connect(mapStateToProps)(EditTemplate)
