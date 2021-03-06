import React, { useEffect, useState } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import styled, { css } from 'styled-components';
import { width } from 'styled-system';
import debounce from 'lodash/debounce';

/*
 * This component is built using `gatsby-image` to automatically serve optimized
 * images with lazy loading and reduced file sizes. The image is loaded using a
 * `StaticQuery`, which allows us to load the image from directly within this
 * component, rather than having to pass the image data down from pages.
 *
 * For more information, see the docs:
 * - `gatsby-image`: https://gatsby.dev/gatsby-image
 * - `StaticQuery`: https://gatsby.dev/staticquery
 */

const Image = styled(Img)`
  width: 640px;
`;

const Wrapper = styled.div`
  ${width}
  position: absolute;
  z-index: 0;
  transition: 0.8s cubic-bezier(0.445, 0.05, 0.55, 0.95);
  transform: translate(-50%, -50%);
  will-change: transform, rotate;
  ${({ scroll, discreet }) => {
    let transformFactor = 50;
    transformFactor = Math.max(10, 66 / (1 + scroll / 500));
    const maxOpacity = discreet ? 0.4 : 0.75;
    return css`
      transform: translate(-${transformFactor}%, -${transformFactor}%)
        rotate(${scroll / 4}deg);
      opacity: ${Math.min(maxOpacity, 100 / scroll)};
      filter: hue-rotate(${scroll}deg);
    `;
  }}
`;

const ArtHeader = ({ discreet }) => {
  const [scroll, setScroll] = useState(0);
  const scrollListener = debounce(() => {
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => setScroll(window.scrollY));
    }
  }, 100);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', scrollListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', scrollListener);
      }
    };
  }, []);
  return (
    <StaticQuery
      query={graphql`
        query {
          image: file(relativePath: { eq: "14-colored.png" }) {
            childImageSharp {
              fluid(maxWidth: 640, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      `}
      render={data => (
        <Wrapper scroll={scroll} discreet={discreet}>
          <Image fluid={data.image.childImageSharp.fluid} />
        </Wrapper>
      )}
    />
  );
};

export default ArtHeader;
