import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import styles from "./styles.module.css";
import Sidebar from "../SideBar";


const MainLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    if (mediaQuery.matches) {
      setIsOpen(false);
    }

    const handleResize = (e: MediaQueryListEvent) => {
      setIsOpen(!e.matches);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <>
      <div className={styles.layoutContainer}>
        <div ref={sidebarRef}>
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        </div>

        <div
          className={`${styles.content} ${isOpen ? styles.contentShift : ""}`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
