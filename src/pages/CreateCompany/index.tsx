import React, { useState } from "react";
import { Form, Input, Button, Typography, notification } from "antd";
import { supabase } from "../../api/supabaseClient";
import styles from "./styles.module.css";
const { Title } = Typography;

const CreateCompany: React.FC = () => {
  const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values: { name: string }) => {
    setLoading(true);

    const { data: company, error } = await supabase
      .from("companies")
      .insert({ name: values.name })
      .select()
      .single();

    if (error || !company) {
      api.error({
        message: "Erro ao criar empresa",
        description: "Não foi possível salvar a empresa. Tente novamente.",
      });
      console.error(error);
      setLoading(false);
      return;
    }

    api.success({
      message: "Empresa criada com sucesso!",
      description: "A empresa foi criada com sucesso.",
    });


    setLoading(false);
  };

  return (
    <>
      {contextHolder}
    <div className={styles.container}>
      <div className={styles.formCard}>
        <Title level={3} className={styles.title}>Criar Empresa 🏢</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Nome da Empresa"
            name="name"
            rules={[{ required: true, message: "Informe o nome da empresa" }]}
          >
            <Input placeholder="Ex: Easy Weddings" />
          </Form.Item>
  
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Criar Empresa
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
    </>
  );
};

export default CreateCompany;