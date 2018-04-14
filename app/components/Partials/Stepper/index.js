import React from 'react'
import cn from 'classnames'

export default class Stepper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: this.props.active
    }
  }

  componentWillReceiveProps(nextProps) {
    const { active } = nextProps

    if (active !== this.state.active) {
      this.setState({ active })
    }
  }

  changeStep(step, key) {
    this.setState({
      active: key
    })

    this.props.onChange(step, key)
  }

  render() {
    const {
      steps,
      disableClick,
      isWorking,
      isCurrentStageFinished = true
    } = this.props
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
              style={{
                width: `${100 / steps.length}%`,
                cursor: disableClick ? 'not-allowed' : 'pointer'
              }}
              onClick={() => !disableClick && this.changeStep(step, key)}
            >
              <a
                className="persistant-disabled"
                data-toggle="tab"
                aria-controls={`stepper-step-${step}`}
                role="tab"
                title={step}
              >
                <span className="round-tab">
                  {(key < active ||
                    (key === active && isCurrentStageFinished)) && (
                    <i
                      className={`fa ${
                        isWorking && active === key
                          ? 'fa-spin fa-spinner'
                          : 'fa-check'
                      } fa-1x`}
                    />
                  )}

                  {key === active &&
                    !isCurrentStageFinished && (
                      <i
                        className={`fa ${
                          isWorking && active === key
                            ? 'fa-spin fa-spinner'
                            : ''
                        } fa-1x`}
                      />
                    )}
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
