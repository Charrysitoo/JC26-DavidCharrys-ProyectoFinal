import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./Home";
import Menu from "./Menu";
import Order from "./Order";
import Contact from "./Contact";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/pedidos" element={<Order />} />
        <Route path="/contacto" element={<Contact />} />
      </Routes>
      <ChatWidget />
    </BrowserRouter>
  );
}
