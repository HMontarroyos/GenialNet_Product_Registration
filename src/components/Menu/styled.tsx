import styled from "styled-components";

export const Menu = styled.section`
  width: 150px;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.primary};
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding-top: 20px;
  border-top-right-radius: 25px; 
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const Item = styled.li`
  font-family: ${(props) => props.theme.fonts.title};
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${(props) => props.theme.colors.text};
  font-size: 15px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0px;
  cursor: pointer;
  transition: color 0.2s;
  padding-top: 10px;

  &:hover {
    color: ${(props) => props.theme.colors.dark};
  }
`;
