import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const createHelpers = (width, height, css) => {
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

const sizes = sanitizeSizes({
  small: { width: 16, height: 16 },
  medium: { width: 24, height: 24 },
  large: { width: 32, height: 32 }
});

const Image = styled.svg`
  ${propsToCss}
`;

const children = (
  <Fragment>
    <g fill="#000" clipPath="url(#clip0)" key="key-0">
      <path d="M19 8.5a1 1 0 100-2h-7a1 1 0 100 2h7zM12.5 11a1 1 0 000 2h4a1 1 0 000-2h-4z" />
      <path d="M23.414 3L21 .585A2 2 0 0019.586 0H8a2 2 0 00-2 2v7.682a.244.244 0 00.184.235c.514.142.998.375 1.429.688A.247.247 0 008 10.4V2.5a.5.5 0 01.5-.5h10.879a.5.5 0 01.353.146l2.122 2.122a.5.5 0 01.146.353V18a.5.5 0 01-.5.5h-9.75a.25.25 0 00-.25.25v1.5a.25.25 0 00.25.25H22a2 2 0 002-2V4.415A1.999 1.999 0 0023.414 3z" />
      <path d="M8.611 15.512a.123.123 0 01-.111-.119V14.25a3.5 3.5 0 10-7 0v1.134a.114.114 0 01-.113.128A1.5 1.5 0 000 17v5.5A1.5 1.5 0 001.5 24h7a1.5 1.5 0 001.5-1.5V17a1.5 1.5 0 00-1.389-1.488zM5 21.25a1 1 0 110-2 1 1 0 010 2zm1.5-5.866a.12.12 0 01-.106.116H3.612a.122.122 0 01-.112-.116V14.25a1.5 1.5 0 013 0v1.134z" />
    </g>
    <defs key="key-1">
      <clipPath id="clip0">
        <path fill="#fff" d="M0 0h24v24H0V0z" />
      </clipPath>
    </defs>
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
  displayName: "Perm"
});