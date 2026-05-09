import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

/**
 * Root layout: renders the persistent Navbar above every page.
 * The <Outlet /> is where the current page renders.
 */
const Layout = () => (
  <>
    <Navbar />
    <main className="pt-24 min-h-screen">
      <Outlet />
    </main>
  </>
);

export default Layout;
