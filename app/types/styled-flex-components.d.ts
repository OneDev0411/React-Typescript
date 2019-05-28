declare module 'styled-flex-component' {
  type FlexItemProps = Partial<{
    order: number
    basis: number
    grow: number
    shrink: number
    noShrink: boolean
  }>

  type FlexProps = Partial<{
    full: boolean
    inline: boolean
    center: boolean
    rowReverse: boolean
    column: boolean
    columnReverse: boolean
    wrap: boolean
    wrapReverse: boolean
    alignCenter: boolean
    alignStart: boolean
    alignEnd: boolean
    alignBaseline: boolean
    alignStretch: boolean
    alignCenter: boolean
    contentCenter: boolean
    contentStart: boolean
    contentEnd: boolean
    contentBaseline: boolean
    contentStretch: boolean
    contentAround: boolean
    justifyCenter: boolean
    justifyStart: boolean
    justifyEnd: boolean
    justifyBetween: boolean
    justifyAround: boolean
    justifyEvenly: boolean
  }>

  export class FlexItem extends React.Component<FlexItemProps> {}

  class Flex extends React.Component<FlexProps> {}

  export default Flex
}
