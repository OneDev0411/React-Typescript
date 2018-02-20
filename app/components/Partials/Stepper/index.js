import React from 'react'
import cn from 'classnames'

export default class Stepper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: this.props.active
    }
  }

  changeStep(step, key) {
    this.setState({
      active: key
    })

    this.props.onChange(step, key)
  }

  render() {
    const { steps } = this.props
    const { active } = this.state

    return (
      <div className="c-stepper">
        <ul className="nav nav-tabs" role="tablist">
          {steps.map((step, key) => (
            <li
              key={`STEP_${step}`}
              role="presentation"
              className={cn({
                active: active === key,
                completed: key <= active
              })}
              style={{ width: `${100 / steps.length}%` }}
              onClick={() => this.changeStep(step, key)}
            >
              <a
                className="persistant-disabled"
                data-toggle="tab"
                aria-controls={`stepper-step-${step}`}
                role="tab"
                title={step}
              >
                <span className="round-tab">
                  {key <= active && <i className="fa fa-check fa-1x" />}
                </span>
              </a>
              <span className="name">{step}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
