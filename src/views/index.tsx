import { lazy } from "react";

const Home = lazy(async () => await import("./Home"));
const NotFound = lazy(async () => await import("./NotFound"));

export { Home, NotFound };
