import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { supabase } from "../../api/supabaseClient";

const { Title } = Typography;

const CreateCompany: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { name: string }) => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    // Cria a empresa
    const { data: company, error } = await supabase
      .from("companies")
      .insert({ name: values.name })
      .select()
      .single();

    if (error || !company) {
      message.error("Erro ao criar empresa");
      console.error(error);
      setLoading(false);
      return;
    }

    if (!user) {
      message.error("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    const { error: userError } = await supabase
      .from("users")
      .update({ company_id: company.id })
      .eq("id", user.id);

    if (userError) {
      message.warning("Empresa criada, mas não foi possível associar o usuário.");
      console.error(userError);
    } else {
      message.success("Empresa criada com sucesso!");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
      <Title level={3}>Criar Empresa 🏢</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Nome da Empresa"
          name="name"
          rules={[{ required: true, message: "Informe o nome da empresa" }]}
        >
          <Input placeholder="Ex: Easy Weddings" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Criar Empresa
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCompany;