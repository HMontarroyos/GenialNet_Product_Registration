import { lazy } from "react";

import Button from "./Button";
import Menu from "./Menu";

const Header = lazy(async () => await import("./Header"));

export { Button, Menu,  Header };
