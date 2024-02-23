import styled from "styled-components";

export const Container = styled.div`
  margin-top: 10px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  display: flex;
`;

export const Paragraph = styled.p`
  margin-top: 80px;
  font-family: ${(props) => props.theme.fonts.text};
  color: ${(props) => props.theme.colors.primary};
  white-space: nowrap;
  font-size: 25px;
  line-height: 20px;
  font-weight: 400;
  letter-spacing: 0px;
`;

export const Alert = styled.p`
  margin-top: 20px;
  font-family: ${(props) => props.theme.fonts.text};
  color: red;
  white-space: nowrap;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0px;
`;




export const Title = styled.h1`
  margin-top: 10px;
  font-family: ${(props) => props.theme.fonts.title};
  font-size: 30px;
  color: ${(props) => props.theme.colors.primary};
  line-height: 20px;
  font-weight: 600;
`;
