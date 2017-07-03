import React, { Component } from 'react'
import S from 'shorti'
import SideBar from '../../Partials/SideBar'
import MobileNav from '../../Partials/MobileNav'
import config from '../../../../../../config/public'

export default class DealFormPreview extends Component {

  constructor(props) {
    super(props)

    this.state = {
      id: props.params.id,
      index: props.params.index,
      type: props.params.type,
      url: null
    }
  }

  componentDidMount() {
    const { type } = this.state

    if (type === 'envelope')
      this.loadEnvelopeForm()
    else if (type === 'submission')
      this.loadSubmissionForm()
    else
      return false
  }

  loadEnvelopeForm() {
    const { id, index } = this.state
    const { data } = this.props
    const token = data.user.access_token
    const base_url = `${config.app_url}/api/deals/envelope/preview`
    const url = `${base_url}?id=${id}&index=${index}&access_token=${token}`
    this.setState({ url })
  }

  loadSubmissionForm() {
    const { id } = this.state
    const { data } = this.props
    const token = data.user.access_token
    const url = `${config.forms.url}/submissions/${id}.pdf?token=${token}&flat=1`
    this.setState({ url })
  }

  render() {
    const { data } = this.props
    const { url } = this.state
    const user = data.user

    return (
      <div className="deals" style={main_style}>
        {
          url &&
          <iframe
            frameBorder="0"
            src={`${url}`}
            style={{ width: '100%', minHeight: '85vh' }}
          />
        }
      </div>
    )
  }
}

DealFormPreview.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object,
  location: React.PropTypes.object
}
