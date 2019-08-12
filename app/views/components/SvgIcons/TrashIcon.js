import React from 'react'
import PropTypes from 'prop-types'

const defaultProps = {
  size: 16,
  color: '#0945eb'
}

const propTypes = {
  size: PropTypes.number,
  color: PropTypes.string
}

function TrashIcon({ size, color, props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...props}>
      <path
        fill={color}
        d="M17.42 9.313H6.58a.36.36 0 0 0-.364.386l.936 10.013c.068.73.696 1.288 1.449 1.288h6.798c.752 0 1.38-.559 1.448-1.288l.935-10.013a.348.348 0 0 0-.094-.271.368.368 0 0 0-.268-.116zm-6.691 9.208a.538.538 0 0 1-.546.531.538.538 0 0 1-.545-.531v-6.375c0-.294.244-.531.545-.531.302 0 .546.237.546.53v6.376zm3.636 0a.538.538 0 0 1-.545.531.538.538 0 0 1-.546-.531v-6.375c0-.294.244-.531.546-.531.3 0 .545.237.545.53v6.376zm4.908-11.688h-3.455a.18.18 0 0 1-.182-.177v-.885c0-.978-.814-1.771-1.818-1.771h-3.636c-1.004 0-1.818.793-1.818 1.77v.886a.18.18 0 0 1-.182.177H4.727A.718.718 0 0 0 4 7.542c0 .39.326.708.727.708h14.546A.718.718 0 0 0 20 7.542a.718.718 0 0 0-.727-.709zm-9.455-.177v-.885c0-.196.163-.354.364-.354h3.636c.201 0 .364.158.364.354v.885a.18.18 0 0 1-.182.177h-4a.18.18 0 0 1-.182-.177z"
      />
    </svg>
  )
}

TrashIcon.propTypes = propTypes
TrashIcon.defaultProps = defaultProps

export default TrashIcon
