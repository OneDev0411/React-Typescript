export function getContextProperties(key: string) {
  return (
    {
      year_built: {
        placeholder: 'YYYY',
        mask: [/[1-2]/, /\d/, /\d/, /\d/]
      }
    }[key] || {}
  )
}
