import { Suspense, lazy } from 'react'

const Calendar = lazy(() => import('./GridCalendar.tsx'))

export default function GridCalendar(props) {
  return (
    <Suspense fallback={null}>
      <Calendar {...props} />
    </Suspense>
  )
}
