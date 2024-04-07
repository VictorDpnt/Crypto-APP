import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Acceuil from "./Acceuil";
import InfosCoins from "./pages/InfosCoins";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Acceuil />} />
        <Route path="/:id" element={<InfosCoins />} />
        <Route path="*" element={<Acceuil />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
