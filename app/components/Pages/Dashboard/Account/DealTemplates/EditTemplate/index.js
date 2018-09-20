import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import PageHeader from '../../../../../../views/components/PageHeader'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

import {
  getFormTemplates,
  saveFormTemplate
} from '../../../../../../models/Deal/form'
import { getActiveTeamId } from '../../../../../../utils/user-teams'

class EditTemplate extends React.Component {
  state = {
    isWorking: false,
    isFrameLoaded: false,
    templates: []
  }

  get BrandId() {
    const { user } = this.props

    return getActiveTeamId(user)
  }

  getTemplate = async () => {
    const { form } = this.props

    this.setState({ isWorking: true, isFrameLoaded: true })

    try {
      const templates = await getFormTemplates(this.BrandId, form.id)

      this.setState({ templates, isWorking: false })
    } catch (e) {
      console.log(e)
    }
  }

  get TemplatesValues() {
    let values = {}
    const { templates } = this.state

    templates.forEach(
      template => (values = Object.assign({}, values, template.values))
    )

    return values
  }

  onReceiveMessage = (functionName, args) => {
    try {
      this[functionName](args)
    } catch (e) {
      console.warn(e.message)
    }
  }

  onLoad = async () => {
    await this.getTemplate()
    this.frame.sendMessage('setDeal', [{ roles: [] }])
  }

  onSetDeal = () => {
    this.frame.sendMessage('setValues', [this.TemplatesValues])
  }

  onGetValues(data) {
    const { isWorking } = this.state

    if (isWorking) {
      return false
    }

    this.setState(
      {
        isWorking: true
      },
      () => this.saveTemplate(data)
    )
  }

  requestSave = () => {
    this.frame.sendMessage('getValues')
  }

  saveTemplate = async data => {
    const { form, notify } = this.props

    try {
      await saveFormTemplate(this.BrandId, form.id, data)

      notify({
        status: 'success',
        message: 'The template has been updated'
      })
    } catch (e) {
      console.log(e)
    } finally {
      this.setState({
        isWorking: false
      })
    }
  }

  render() {
    const { form } = this.props
    const { isWorking, isFrameLoaded } = this.state

    return (
      <div className="c-deal-templates--edit">
        <PageHeader backButton>
          <PageHeader.Title>
            <PageHeader.Heading>{form.name}</PageHeader.Heading>
          </PageHeader.Title>

          <PageHeader.Menu>
            {isWorking && <i className="icon-save fa fa-spin fa-spinner" />}

            <ActionButton
              disabled={isWorking || !isFrameLoaded}
              onClick={this.requestSave}
            >
              Save Template
            </ActionButton>
          </PageHeader.Menu>
        </PageHeader>
      </div>
    )
  }
}

function mapStateToProps({ deals, user }, { params }) {
  return {
    user,
    form: deals.forms ? deals.forms[params.id] : null
  }
}

export default connect(
  mapStateToProps,
  { notify }
)(EditTemplate)
