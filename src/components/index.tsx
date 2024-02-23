import { lazy } from "react";

import Button from "./Button";
import Menu from "./Menu";

const Header = lazy(async () => await import("./Header"));
const Loading = lazy(async () => await import("./Loading"));

export { Button, Menu,  Header, Loading };
