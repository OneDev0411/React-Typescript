import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const createHelpers = (width, height, css) => {
  // somehow sizes is ending up in markup, even if it is not a valid svg attribute
  // until we have a better solution, just render it empty, instead to '[Object object]'
  const sanitizeSizes = sizes =>
    Object.defineProperty(sizes, "toString", {
      value: () => "",
      enumerable: false
    });

  const getDimensions = (size, sizes) => {
    if (
      size &&
      typeof size.width === "number" &&
      typeof size.height === "number"
    ) {
      return size;
    }

    return size && sizes[size] ? sizes[size] : { width, height };
  };

  const getCss = (size, sizes, fillColor, fillColorRule, noStyles) => {
    if (noStyles) {
      return "";
    }

    const dimensions = getDimensions(size, sizes);
    const fillRule =
      fillColor && fillColorRule
        ? `${fillColorRule}{ fill: ${fillColor}; }`
        : "";

    return css`
      width: ${dimensions.width}px;
      height: ${dimensions.height}px;
      ${fillRule}
    `;
  };

  const propsToCss = ({ size, sizes, fillColor, fillColorRule, noStyles }) =>
    getCss(size, sizes, fillColor, fillColorRule, noStyles);

  return {
    getCss,
    getDimensions,
    propsToCss,
    sanitizeSizes
  };
};

const width = "24";
const height = "24";
const viewBox = "0 0 24 24";

const { getDimensions, getCss, propsToCss, sanitizeSizes } = createHelpers(
  width,
  height,
  css
);

const sizes = sanitizeSizes({});

const Image = styled.svg`
  ${propsToCss}
`;

const children = (
  <Fragment>
    <path
      fill="#000"
      fillRule="evenodd"
      d="M8.667 2.75A1.917 1.917 0 006.75 4.667V17h10.5V4.667a1.917 1.917 0 00-1.917-1.917H8.667zM6.75 19.333V18.5h10.5v.833a1.917 1.917 0 01-1.917 1.917H8.667a1.917 1.917 0 01-1.917-1.917zM5.25 4.667A3.417 3.417 0 018.667 1.25h6.666a3.417 3.417 0 013.417 3.417v14.666a3.417 3.417 0 01-3.417 3.417H8.667a3.417 3.417 0 01-3.417-3.417V4.667zM11.5 19.05a.75.75 0 000 1.5h1a.75.75 0 000-1.5h-1z"
      clipRule="evenodd"
      key="key-0"
    />
  </Fragment>
);

const defaultProps = {
  children,
  viewBox,
  fillColor: null,
  fillColorRule: "&&& path, &&& use, &&& g",
  sizes,
  size: null
};

Image.propTypes /* remove-proptypes */ = {
  fillColor: PropTypes.string,
  fillColorRule: PropTypes.string,
  viewBox: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired
    })
  ]),
  sizes: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number
  })
};

export default Object.assign(Image, {
  getDimensions,
  getCss,
  defaultProps,
  displayName: "Mobile"
});
