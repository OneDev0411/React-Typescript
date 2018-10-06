import React from 'react'
import PropTypes from 'prop-types'
import fecha from 'fecha'

import Brand from '../../../../../controllers/Brand'
import { getActiveTeam } from '../../../../../utils/user-teams'
import { getUserTitle } from '../../../../../models/user/helpers/get-user-title'
import { H1 } from '../../../Typography/headings'

import { Map } from '../../TourDrawer/components/Locations/Map'

import '../styles/shared.scss'
import './style.scss'

const propTypes = {
  agent: PropTypes.shape().isRequired,
  tour: PropTypes.shape().isRequired
}

const TOUR_SHEETS_CSS_NAME = 'c-tour-sheets'
const COVER_PAGE_CSS_NAME = 'c-tour-sheets-cover'

export function CoverPage(props) {
  const { agent, tour } = props
  const { description } = tour

  let officeLogoSrc
  const activeTeam = getActiveTeam(agent)

  if (activeTeam && activeTeam.brand) {
    officeLogoSrc = Brand.asset('office_logo', null, activeTeam.brand)
  }

  return (
    <div className={`${TOUR_SHEETS_CSS_NAME}__page ${COVER_PAGE_CSS_NAME}`}>
      <div className={`${TOUR_SHEETS_CSS_NAME}__brand-line`} />
      <div
        style={{
          fontSize: '0.75rem',
          marginBottom: '6rem'
        }}
      >
        <H1 style={{ marginBottom: '0.5rem' }}>{tour.title}</H1>
        <p
          style={{
            marginBottom: description ? '1rem' : 0
          }}
        >
          {fecha.format(
            new Date(tour.due_date * 1000),
            'dddd, MMMM DD, YYYY hh:mm A'
          )}
        </p>
        {description && (
          <p
            style={{
              fontSize: '0.75rem',
              margin: 0
            }}
          >
            {description}
          </p>
        )}
      </div>
      <div style={{ marginBottom: '2.5rem', fontSize: '0.75rem' }}>
        <p
          style={{
            marginBottom: '0.5rem',
            color: '#7f7f7f'
          }}
        >
          Prepared by
        </p>
        <div style={{ fontWeight: 600 }}>
          {[getUserTitle(agent), agent.email, agent.phone_number]
            .filter(a => a)
            .join(' | ')}
        </div>
      </div>
      <div
        className="u-print-bg"
        style={{
          width: '31.25rem',
          height: '17.4375rem',
          margin: '0 auto 2rem',
          background: '#f7f7f7'
        }}
      >
        <Map
          id="tour-sheets-cover-map"
          listings={props.listings}
          defaultOptions={{ zoomControl: false, draggable: false }}
        />
      </div>
      {officeLogoSrc && (
        <img
          alt="office"
          src={officeLogoSrc}
          style={{
            maxWidth: '13.5rem',
            maxHeight: '4em',
            margin: '0 auto'
          }}
        />
      )}
    </div>
  )
}

CoverPage.propTypes = propTypes
