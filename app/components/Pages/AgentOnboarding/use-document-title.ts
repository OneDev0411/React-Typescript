import { useTitle } from 'react-use'

export function useDocumentTitle(title: string) {
  useTitle(`${title} | Onboarding | Rechat`)
}
