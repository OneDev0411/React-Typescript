import { connect } from 'react-redux'
import { activeIntercom } from '../../../../../store_actions/intercom'

const IntercomButton = ({ render, intercomIsActive, activeIntercom }) =>
  render({ activeIntercom, intercomIsActive })

export default connect(
  ({ intercom }) => ({
    intercomIsActive: intercom.isActive
  }),
  { activeIntercom }
)(IntercomButton)
