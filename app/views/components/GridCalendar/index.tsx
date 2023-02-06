import { Suspense, lazy } from 'react'

const Calendar = lazy(() => import('./GridCalendar'))

export default function GridCalendar(props) {
  return (
    <Suspense fallback={null}>
      <Calendar {...props} />
    </Suspense>
  )
}
