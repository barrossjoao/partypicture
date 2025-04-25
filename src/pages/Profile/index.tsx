import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, notification } from "antd";
import styles from "./styles.module.css";
import { useUser } from "../../context/UserContext";
import { getUserById, updateUserProfile } from "../../api/Users"; 
const { Title } = Typography;

interface User {
  id: string;
  name: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [userData, setUserData] = useState<User | null>(null);
  const { user } = useUser();

  const fetchUserData = async () => {
    if (!user) return;
    try {
      const data = await getUserById(user.id);
      setUserData(data);
      if (!data) {
        api.error({
          message: "Erro ao carregar dados",
          description: "Usuário não encontrado.",
        });
        return;
      }
      form.setFieldsValue({
        name: data.name,
        email: data.email,
      });
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      api.error({
        message: "Erro ao carregar dados",
        description: "Não foi possível buscar os dados do perfil.",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const onFinish = async (values: { name: string; email: string }) => {
    if (!userData) return;

    setLoading(true);
    try {
      await updateUserProfile(userData.id, values.name, values.email);

      api.success({
        message: "Perfil atualizado com sucesso!",
      });
    } catch {
      api.error({
        message: "Erro ao atualizar",
        description: "Não foi possível atualizar o perfil.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
      <Title level={3}>Perfil</Title>

        <div className={styles.formCard}>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              name: "",
              email: "",
            }}
          >
            <Form.Item
              label="Nome"
              name="name"
              rules={[{ required: true, message: "Informe o nome" }]}
            >
              <Input placeholder="Seu nome" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Informe o e-mail" }]}
            >
              <Input type="email" placeholder="Seu e-mail" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Atualizar Perfil
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;