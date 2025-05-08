import Header from "@components/Header";
import { Outlet } from "react-router-dom";

export default function AppContent() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
