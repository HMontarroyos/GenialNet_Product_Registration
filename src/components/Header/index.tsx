import { Logo } from "../../assets/images";
import * as S from "./styled";

function Header() {
  return (
    <>
      <S.HeaderAnimation />
      <S.Header>
        <S.LinkRedirect to={"/"}>
          <img src={Logo} width={"220px"} height={"69px"} />
        </S.LinkRedirect>
      </S.Header>
    </>
  );
}

export default Header;
