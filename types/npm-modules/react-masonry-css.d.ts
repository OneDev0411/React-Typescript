/**
 * NOTE: currently, the latest version of react-masonry-css (1.0.13) contains
 * type definitions but it's not correct and columnClassName and className
 * are required in the type definitions for Masonry props.
 * Whenever it's fixed, we can remove this file and upgrade the library
 */

declare module 'react-masonry-css' {
  import * as React from 'react'

  export interface MasonryProps {
    breakpointCols?: number | { default: number; [key: number]: number }
    columnClassName?: string
    className?: string
  }

  export default class Masonry extends React.Component<
    MasonryProps & React.HTMLProps<HTMLElement>,
    any
  > {
    render(): JSX.Element
  }
}
