import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./views";
import { Header } from "./components";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<h1>Loading ...</h1>}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
