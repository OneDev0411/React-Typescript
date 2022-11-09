import { useInsights } from './use-insights'

export function useInsightsCounter() {
  const { total: totalExecutedList } = useInsights('executed')
  const { total: totalScheduledList } = useInsights('scheduled')

  return {
    executed: totalExecutedList,
    scheduled: totalScheduledList
  }
}
