import Routes from "./routes";
import { ThemeProvider } from "styled-components";
import { Theme, ThemeType } from "../src/styles/Theme";

function App(): JSX.Element {
  return (
    <ThemeProvider theme={Theme as ThemeType}>
      <Routes />
    </ThemeProvider>
  );
}

export default App;
