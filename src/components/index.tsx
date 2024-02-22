import { lazy } from "react";

import Button from "./Button";

const Header = lazy(async () => await import("./Header"));

export { Button, Header };
