import React from "react";
import * as S from "./styled";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
  height?: string;
  disabled?: boolean;
  onClick: () => void;
  text: string;
}

function Button({ width, height, onClick, text, disabled }: ButtonProps): JSX.Element {
  return (
    <S.GradientButton variant="contained" onClick={onClick} disabled={disabled}>
      {text}
    </S.GradientButton>
  );
}

export default Button;
