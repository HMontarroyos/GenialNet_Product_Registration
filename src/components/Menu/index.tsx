import React from "react";
import CategoryIcon from "@mui/icons-material/Category";
import ApartmentIcon from "@mui/icons-material/Apartment";
import * as S from "./styled";

interface MenuProps {
  onItemClick: (item: string) => void;
}

function Menu({ onItemClick }: MenuProps): JSX.Element {
  return (
    <S.Menu>
      <S.List>
        <S.Item onClick={() => onItemClick("produto")}>
          <CategoryIcon />
          Produtos
        </S.Item>
        <S.Item onClick={() => onItemClick("fornecedor")}>
          <ApartmentIcon />
          Fornecedor
        </S.Item>
      </S.List>
    </S.Menu>
  );
}

export default Menu;
