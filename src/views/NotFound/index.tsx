import React from "react";
import * as S from "./styled";

const NotFound: React.FC = () => {
  return (
    <S.Container>
      <S.Subtitle>OPAH!</S.Subtitle>
      <S.Title>404</S.Title>
      <S.Paragraph>
        Parece que você está perdido! Tente voltar a pagina inicial por{" "}
        <S.LinkRedirect to={"/"}>aqui</S.LinkRedirect>
      </S.Paragraph>
    </S.Container>
  );
};

export default NotFound;
