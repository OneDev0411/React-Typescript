import { useEffectOnce } from 'react-use'

function useBackgroundColor(color: string) {
  useEffectOnce(() => {
    const oldColor = document.body.style.backgroundColor

    document.body.style.backgroundColor = color

    return () => {
      document.body.style.backgroundColor = oldColor
    }
  })
}

export default useBackgroundColor
