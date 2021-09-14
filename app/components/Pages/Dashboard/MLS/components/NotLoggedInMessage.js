import { Link } from 'react-router'
import branch from 'recompose/branch'
import renderNothing from 'recompose/renderNothing'

const hideIfNotLoggedIn = hasNoData => branch(hasNoData, renderNothing)

const enhance = hideIfNotLoggedIn(props => props.isLoggedIn)

const RegisterOrLoginMessage = enhance(() => (
  <p className="c-notLoggedIn-message">
    <Link to="/signup">Sign up</Link> or <Link to="/signin">Sign in</Link>
    <span> to save listings and chat with our agents.</span>
  </p>
))

export default RegisterOrLoginMessage
