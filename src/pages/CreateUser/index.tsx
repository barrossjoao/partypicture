import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Select,
  notification,
} from "antd";
import { supabase } from "../../api/supabaseClient";
import { getCompanies } from "../../api/Companies";

const { Title } = Typography;
const { Option } = Select;

interface Company {
  id: string;
  name: string;
}

const CreateUserPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const fetchCompanies = async () => {
      await getCompanies()
        .then((data) => {
          setCompanies(data);
        })
        .catch((error) => {
          console.error("Error fetching companies:", error);
          api.error({
            message: "Erro ao buscar empresas",
            description:
              "Não foi possível buscar as empresas. Tente novamente.",
          });
        });
    };

    fetchCompanies();
  }, []);

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    role: string;
    company_id: string;
  }) => {
    setLoading(true);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          },
        },
      }
    );

    if (signUpError || !signUpData.user) {
      api.error({
        message: "Erro ao criar usuário",
        description: "Não foi possível criar o usuário. Tente novamente.",
      });
      console.error(signUpError);
      setLoading(false);
      return;
    }

    const userId = signUpData.user.id;

    const { error: insertError } = await supabase.from("users").insert({
      id: userId,
      name: values.name,
      email: values.email,
      role: values.role,
      company_id: values.company_id,
    });

    if (insertError) {
      api.error({
        message: "Erro ao criar usuário",
        description: "Não foi possível salvar o usuário. Tente novamente.",
      });
      console.error(insertError);
    } else {
      api.success({
        message: "Usuário criado com sucesso!",
        description: "O usuário foi criado e associado à empresa.",
      });
    }

    setLoading(false);
  };

  return (
    <>
      {contextHolder}
      <div style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
        <Title level={3}>Criar Usuário 👤</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: "Informe o nome" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, type: "email", message: "Email inválido" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: "Informe uma senha" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Função"
            name="role"
            rules={[{ required: true, message: "Selecione a função" }]}
          >
            <Select placeholder="Escolha o tipo de usuário">
              <Option value="company_user">Usuário</Option>
              <Option value="company_admin">Admin da empresa</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Empresa"
            name="company_id"
            rules={[{ required: true, message: "Selecione a empresa" }]}
          >
            <Select placeholder="Selecione uma empresa">
              {companies.map((company) => (
                <Option key={company.id} value={company.id}>
                  {company.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Criar Usuário
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CreateUserPage;
