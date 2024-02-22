import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

export const AnimationGradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
`;

export const HeaderAnimation = styled.header`
  background-size: 200% 200%;
  animation: ${AnimationGradient} 2s linear infinite alternate;
  background-image: linear-gradient(-45deg, 
    ${(props) => props.theme.colors.primary},
    ${(props) => props.theme.colors.secondary},
    ${(props) => props.theme.colors.tertiary});
  width: 100%;
  height: 40px;
`;

export const Header = styled.header`
  padding: ${(props) => props.theme.spacing.large};
  height: 80px;
  background-color: #fff;
`;

export const LinkRedirect = styled(Link)`
  text-decoration: none;
  margin-left: 10px;
`;
