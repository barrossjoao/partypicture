import React, { useEffect, useState } from "react";
import { Modal, Menu, Avatar } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./styles.module.css";
import { FaArrowLeft } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import { supabase } from "../../api/supabaseClient";
import { PiCalendarPlusDuotone } from "react-icons/pi";
import { TbLogout2 } from "react-icons/tb";
import { BiParty } from "react-icons/bi";
import { FiUser, FiUserPlus } from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const showLogoutModal = () => {
    setIsModalVisible(true);
  };

  const handleConfirmLogout = async () => {
    setIsModalVisible(false);
    try {
      await supabase.auth.signOut();
      setUserName(null);
      navigate("/");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  const handleCancelLogout = () => {
    setIsModalVisible(false);
  };

  const selectedKey = () => {
    if (location.pathname.startsWith("/home")) return "1";
    if (location.pathname.startsWith("/create-event")) return "2";
    if (location.pathname.startsWith("/create-user")) return "3";
    if (location.pathname.startsWith("/create-company")) return "4";
    if (location.pathname.startsWith("/profile")) return "5";
    if (location.pathname.startsWith("/admin")) return "admin";
    return "1";
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          const userId = session.session.user.id;

          const { data: userData, error } = await supabase
            .from("users")
            .select("name, role")
            .eq("id", userId)
            .single();

          if (error) {
            console.error("Erro ao buscar informações do usuário:", error);
          } else {
            setUserName(userData?.name || "Usuário");
            if (userData?.role === "admin") setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  }, [setUserName]);

  return (
    <>
      <div
        className={`${styles["toggle-button-wrapper"]} ${
          isOpen ? "" : styles["closed"]
        }`}
      >
        <div className={styles["toggle-button"]} onClick={toggleSidebar}>
          {isOpen ? (
            <FaArrowLeft color="#3174ad" />
          ) : (
            <GiHamburgerMenu size={22} color="#3174ad" />
          )}
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey()]}
        style={{ height: "100%", borderRight: 0, paddingTop: "60px", backgroundColor: "#f5f5f5" }}
        className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
      >
        <h2 className={styles.title} onClick={() => navigate("/home")}>
          Menu
        </h2>

        {isAdmin && (
          <Menu.Item
            key="admin"
            icon={<RxDashboard />}
            onClick={() => navigate("/admin")}
            className={styles.itemMenu}
          >
            Dashboard
          </Menu.Item>
        )}

        <Menu.Item
          key="1"
          icon={<BiParty size={18} />}
          onClick={() => navigate("/home")}
          className={styles.itemMenu}
        >
          Eventos
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={<PiCalendarPlusDuotone size={18} />}
          onClick={() => navigate("/create-event")}
          className={styles.itemMenu}
        >
          Criar Evento
        </Menu.Item>
        {isAdmin && (
          <>
        <Menu.Item
          key="3"
          icon={<FiUserPlus size={18} />}
          onClick={() => navigate("/create-user")}
          className={styles.itemMenu}
        >
          Criar Usuário
        </Menu.Item>
        <Menu.Item
          key="4"
          icon={<BsBuilding size={18} />}
          onClick={() => navigate("/create-company")}
          className={styles.itemMenu}
        >
          Criar Empresa
        </Menu.Item>
        <Menu.Item
          key="5"
          icon={<FiUser size={18} />}
          onClick={() => navigate("/profile")}
          className={styles.itemMenu}
        >
          Profile
        </Menu.Item>
        </>
        )}
        <Menu.Item
          key="6"
          icon={<TbLogout2 size={17} />}
          onClick={showLogoutModal}
          className={styles.itemMenu}
        >
         Sair
        </Menu.Item>

        <div className={styles.userProfile}>
          {loading ? (
            <div className={styles.loadingContainer}>Carregando...</div>
          ) : (
            <>
              <Avatar
                className={styles.userAvatar}
                style={{
                  backgroundColor: "#1677ff",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {userName?.charAt(0).toUpperCase() || "?"}
              </Avatar>
              <span className={styles.userName}>
                {userName
                  ? userName.split(" ")[0].charAt(0).toUpperCase() +
                    userName.split(" ")[0].slice(1)
                  : "Usuário"}
              </span>
            </>
          )}
        </div>
      </Menu>

      <Modal
        title="Deseja sair?"
        open={isModalVisible}
        onOk={handleConfirmLogout}
        onCancel={handleCancelLogout}
        okText="Sim, sair"
        cancelText="Cancelar"
      >
        <p>Você tem certeza que deseja sair da conta?</p>
      </Modal>
    </>
  );
};

export default Sidebar;