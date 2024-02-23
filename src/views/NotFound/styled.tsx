import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-wrap: wrap;
`;

export const Subtitle = styled.span`
  font-size: 28px;
  display: block;
  margin-bottom: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.disabled};
  font-family: ${(props) => props.theme.fonts.title};
`;

export const Title = styled.h1`
  font-size: 220px;
  line-height: 100%;
  display: block;
  font-weight: 300;
  padding-bottom: 20px;
  margin-bottom: 20px;
  color: ${(props) => props.theme.colors.tertiary};
  font-family: ${(props) => props.theme.fonts.title};
`;

export const Paragraph = styled.p`
  margin-top: 20px;
  font-size: 20px;
  color: ${(props) => props.theme.colors.disabled};
  line-height: 1.66em;
  font-family: ${(props) => props.theme.fonts.text};
`;

export const LinkRedirect = styled(Link)`
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  color: ${(props) => props.theme.colors.primary};
  &:hover {
    color: ${(props) => props.theme.colors.secondary};
  }
`;
