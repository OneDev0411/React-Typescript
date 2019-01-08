export const getMQWidth = (base, props) => {
  const w = props.isSideMenuOpen ? base + 11 : base

  return `${w}em`
}
