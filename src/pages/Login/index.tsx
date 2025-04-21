import React, { useState } from "react";
import { Button, Divider, Input, notification, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { supabase } from "../../api/supabaseClient";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

type NotificationType = "success" | "info" | "warning" | "error";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const isSpinning = loading;

  const openNotificationWithIcon = (
    type: NotificationType,
    message: string,
    description: string
  ) => {
    api[type]({
      message,
      description,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
  
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      openNotificationWithIcon("error", "Erro ao entrar", error.message);
      setLoading(false);
      return;
    }
  
    openNotificationWithIcon("success", "Login realizado", "Bem-vindo de volta!");
    navigate("/home"); 
    setLoading(false);
  };

  // const handleResetPassword = async () => {
  //   setLoading(true);

  // };

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <Spin spinning={isSpinning} tip="Loading...">
          <div className={styles.containerBox}>
            <div className={styles.box}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.title}>Login</h2>
                <Input
                  placeholder="Email"
                  prefix={<MdOutlineMail className={styles.icon} />}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.input}
                />
                <Input.Password
                  placeholder="Senha"
                  prefix={<RiLockPasswordLine className={styles.icon} />}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.input}
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className={styles.loginButton}
                >
                  Entrar
                </Button>
                <Divider className={styles.divider}>Ou</Divider>
                <Button
                  type="link"
                  onClick={() => console.log(true)}
                  className={styles.resetPasswordButton}
                  loading={loading}
                >
                  Esqueci a Senha
                </Button>
              </form>
            </div>
            <div className={styles.boxImage}>
              <img className={styles.img} src="/login.png" alt="Login" />
              <h1 className={styles.titleLogin}>
                &middot; Galeria &middot;
              </h1>
              <h3 className={styles.subtitle}>Envie e veja as fotos da festa em tempo real! Compartilhe os cliques do grande dia 📷</h3>
            </div>
          </div>
        </Spin>
      </div>

      {/* <Modal
        title={t("resetPasswordModal.title")}
        open={resetPasswordVisible}
        onOk={handleResetPassword}
        onCancel={() => setResetPasswordVisible(false)}
        okText={t("resetPasswordModal.send_button")}
        cancelText={t("resetPasswordModal.cancel_button")}
      >
        <p>{t("resetPasswordModal.description")}</p>
        <Input
          placeholder={t("resetPasswordModal.email_placeholder")}
          prefix={<MdOutlineMail className={styles.icon} />}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Modal> */}
    </>
  );
};

export default Login;
