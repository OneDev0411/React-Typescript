import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState
} from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import Joyride from 'react-joyride'

import { OnboardingStepCard } from 'components/Onboarding/OnboardingStepCard'
import { getActiveTeamSettings } from 'utils/user-teams'
import { putUserSetting } from 'models/user/put-user-setting'

const ONBOARDING_SETTING_KEY_PREFIX = 'onboarding_'

Onboarding.propTypes = {
  steps: PropTypes.array.isRequired,
  tourId: PropTypes.string.isRequired,
  callback: PropTypes.func,
  onFinishIntro: PropTypes.func
}

function Onboarding({
  user,
  tourId,
  steps,
  onFinishIntro,
  callback,
  run,
  onboardingRef
}) {
  const SETTING_KEY = `${ONBOARDING_SETTING_KEY_PREFIX}_${tourId}`
  const alreadyShown = getActiveTeamSettings(user, SETTING_KEY)

  const [shown, toggle] = useState(alreadyShown == null)

  useImperativeHandle(onboardingRef, () => ({
    show: () => toggle(true)
  }))

  const normalizedSteps = useMemo(
    () =>
      steps.map(step => ({
        ...step,
        disableBeacon: true,
        tooltipComponent: OnboardingStepCard
      })),
    [steps]
  )

  const onCallback = useCallback(
    data => {
      if ((isCloseEvent(data) || isFinishEvent(data)) && tourId) {
        putUserSetting(SETTING_KEY, '1')
        toggle(false)
        onFinishIntro && onFinishIntro()
      }

      callback && callback(data)
    },
    [SETTING_KEY, callback, onFinishIntro, tourId]
  )

  return (
    shown && (
      <div>
        <Joyride
          autoStart
          steps={normalizedSteps}
          run={run}
          scrollToFirstStep
          disableOverlayClose
          continuous
          spotlightPadding={5}
          floaterProps={{
            hideArrow: true
          }}
          styles={{
            options: {
              overlayColor: 'rgba(0, 0, 0, 0.8)'
            }
          }}
          callback={onCallback}
        />
      </div>
    )
  )
}

const mapStateToProps = state => ({
  user: state.user
})

const ConnectedOnboarding = connect(mapStateToProps)(Onboarding)

export default forwardRef((props, ref) => (
  <ConnectedOnboarding {...props} onboardingRef={ref} />
))

function isCloseEvent({ type, action }) {
  return type === 'step:after' && action === 'close'
}

function isFinishEvent({ type }) {
  return type === 'tour:end'
}
