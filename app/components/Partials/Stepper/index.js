import React from 'react'

export default class Stepper extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      active: this.props.active
    }
  }

  gotoStep(step, key) {
    this.setState({
      active: step
    })

    this.props.onChange(step, key)
  }

  render() {
    const { steps } = this.props
    const { active } = this.state

    return (
      <div className="stepper">
        <ul className="nav nav-tabs" role="tablist">
          {
            steps.map((step, key) => (
              <li
                key={`STEP_${step}`}
                role="presentation"
                className={ active === step ? 'active' : '' }
                style={{ width: (100 / steps.length) + '%' }}
                onClick={() => this.gotoStep(step, key)}
              >
                <a
                  className="persistant-disabled"
                  data-toggle="tab"
                  aria-controls={`stepper-step-${step}`}
                  role="tab"
                  title={ step }
                >
                  <span className="round-tab"></span>
                </a>
                <span className="name">{ step }</span>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}
