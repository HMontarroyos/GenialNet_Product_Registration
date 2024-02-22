import React from "react";
import * as S from "./styled";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
  height?: string;
  onClick: () => void;
  text: string;
}

function Button({ width, height, onClick, text }: ButtonProps): JSX.Element {
  return (
    <S.GradientButton variant="contained" onClick={onClick}>
      {text}
    </S.GradientButton>
  );
}

export default Button;
