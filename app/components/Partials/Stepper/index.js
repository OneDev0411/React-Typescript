import React from 'react'
import cn from 'classnames'
import { mdiCheck } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import './styles.scss'

export default class Stepper extends React.Component {
  state = {
    active: this.props.active
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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
      isProcessing,
      isActiveStageFinished = true
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
                <span
                  className={cn('round-tab', {
                    'is-pending':
                      key === active && !isActiveStageFinished && !isProcessing
                  })}
                >
                  {(key < active ||
                    (key === active && isActiveStageFinished)) && (
                    <SvgIcon path={mdiCheck} />
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
