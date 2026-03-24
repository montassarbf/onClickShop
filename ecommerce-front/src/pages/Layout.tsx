import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
