import styled from "styled-components";

export const Container = styled.div`
  margin-top: 10px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  display: flex;
  margin-left: 30px;
  margin-right: 30px;
`;

export const Paragraph = styled.p`
  margin-top: 80px;
  font-family: ${(props) => props.theme.fonts.text};
  color: ${(props) => props.theme.colors.primary};
  white-space: wrap;
  font-size: 25px;
  line-height: 20px;
  font-weight: 400;
  letter-spacing: 0.5px;
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
  margin-top: 50px;
  margin-bottom: 30px;
  font-family: ${(props) => props.theme.fonts.title};
  font-size: 30px;
  color: ${(props) => props.theme.colors.primary};
  line-height: 20px;
  font-weight: 600;
`;

export const ContainerSupplier = styled.div`
  margin: 20px;
  border: 2px solid ${(props) => props.theme.colors.secondary};
  padding: 30px;
  border-radius: 20px;
`;

export const ContainerTypography = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
`;

export const Typography = styled.p`
  color: ${(props) => props.theme.colors.primary};
  font-family: ${(props) => props.theme.fonts.text};
  font-weight: bold;
`;

export const ContainerProductsList = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
  justify-content: space-between;
  padding: 10px;
  border-radius: 10px;
  background-color: rgba(0, 126, 188, 0.3);
`;

export const ContainerClickRemove = styled.div`
  cursor: pointer;
  color: ${(props) => props.theme.colors.primary};
  &:hover {
    color: ${(props) => props.theme.colors.secondary};
  }
`;

export const TypographyProduct = styled.p`
  color: ${(props) => props.theme.colors.primary};
  font-family: ${(props) => props.theme.fonts.text};
  font-weight: bold;
  font-size: 20px;
`;
