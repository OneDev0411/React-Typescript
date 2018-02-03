import React from 'react'
import { connect } from 'react-redux'
import config from '../../../../../../config/public'

class EditFormFrame extends React.PureComponent {
  constructor(props) {
    super(props)

    if (process.env.NODE_ENV === 'development') {
      config.forms.url = 'http://localhost:3000'
    }
  }

  render() {
    const { task, user } = this.props
    const { access_token } = user
    const host = window.location.hostname

    return (
      <iframe
        className="form-iframe"
        src={`${config.forms.url}/embed/${
          task.form
        }?domain=${host}&access_token=${access_token}`}
        frameBorder="0"
        ref={ref => this.props.frameRef(ref)}
      />
    )
  }
}

export default connect(({ data }) => ({
  user: data.user
}))(EditFormFrame)
