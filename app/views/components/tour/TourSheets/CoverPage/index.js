import PropTypes from 'prop-types'

import { useActiveTeamPalette } from '@app/hooks/team/use-active-team-palette'
import { getUserTitle } from '@app/models/user/helpers/get-user-title'
import { H1 } from '@app/views/components/Typography/headings'

import { Map } from '../../Map'
import { getFormatedDueDate } from '../helpers/get-formated-due-date'
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
  const activeTeamPalette = useActiveTeamPalette()

  const officeLogoSrc =
    activeTeamPalette['container-logo-wide'] ||
    activeTeamPalette['container-logo-square'] ||
    null

  return (
    <div className={`${TOUR_SHEETS_CSS_NAME}__page ${COVER_PAGE_CSS_NAME}`}>
      <div
        style={{
          marginTop: '3rem',
          textAlign: 'center',
          marginBottom: officeLogoSrc ? '4rem' : 0
        }}
      >
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
      <H1 style={{ marginBottom: '0.5rem' }}>
        {tour.title || '[Untitle Tour]'}
      </H1>
      <p style={{ marginBottom: '1rem' }}>{getFormatedDueDate(tour)}</p>
      <div
        style={{
          fontSize: '0.75rem',
          marginBottom: '4rem'
        }}
      >
        {description || '[TOUR DESCRIPTION]'}
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
          margin: '0 auto',
          background: '#f7f7f7'
        }}
      >
        <Map
          id="tour-sheets-cover-map"
          listings={props.listings}
          defaultOptions={{ zoomControl: false, draggable: false }}
        />
      </div>
    </div>
  )
}

CoverPage.propTypes = propTypes
