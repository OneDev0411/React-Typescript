import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router'
import Flex from 'styled-flex-component'

import { grey, borderColor, primary } from '../../../../../views/utils/colors'
import Button from '../../../../../views/components/Button/ActionButton'

const Input = styled.input`
  width: 100%;
  height: 2.5rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid ${borderColor};

  &:focus {
    outline: 'none';
    border-color: ${primary};
  }
`

class Share extends React.Component {
  state = {
    text: ''
  }

  onChangeText = event => this.setState({ text: event.target.value.trim() })

  shareHandler = () => {
    navigator
      .share({
        title: 'A message from Rechat!',
        text: this.state.text,
        url: this.props.location.query.url
      })
      .then(() => console.log('Successful share'))
      .catch(error => console.log('Error sharing', error))
  }

  render() {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <a href="/">
            <img
              alt="brand"
              width="48"
              height="48"
              src="/static/images/appicon.png"
            />
          </a>
        </div>
        <div
          style={{
            minHeight: '50vh',
            width: '100%',
            marginBottom: '1.5rem',
            backgroundColor: grey.A150,
            backgroundImage: `url('${this.props.location.query.url}')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <Flex column center>
          <div style={{ width: '100%' }}>
            {/* eslint-disable-next-line */}
            <label htmlFor="text" style={{ cursor: 'pointer' }}>
              Text
            </label>
            <Input id="text" type="text" onChange={this.onChangeText} />
          </div>
          <Button size="large" onClick={this.shareHandler}>
            Share
          </Button>
        </Flex>
      </div>
    )
  }
}

export default withRouter(Share)
