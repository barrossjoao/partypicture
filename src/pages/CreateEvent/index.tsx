import React, { useState } from "react";
import { Button, Form, Input, Typography, notification } from "antd";
import { supabase } from "../../api/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import QRCode from "react-qr-code";

const { Title, Paragraph } = Typography;

const CreateEventPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [, setSlugCreated] = useState<string | null>(null);
  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values: { name: string; slug: string }) => {
    setLoading(true);

    const slug = values.slug.toLowerCase().replace(/\s+/g, "-");
    const uploadLink = `${window.location.origin}/upload/${slug}`;

    const { error } = await supabase.from("events").insert({
      id: uuidv4(),
      name: values.name,
      slug,
      upload_url: uploadLink,
    });

    if (error) {
      api.error({
        message: "Erro ao criar evento",
        description: "Não foi possível salvar o evento. Tente novamente.",
      });
      console.error(error);
    } else {
      api.success({
        message: "Evento criado com sucesso!",
        description: "O QR Code e o link de upload já estão prontos!",
      });
      
      console.log(`Evento criado com sucesso: ${values.name}`);
      setUploadUrl(uploadLink);
      setSlugCreated(slug);
    }

    setLoading(false);
  };

  return (
    <>
    {contextHolder}
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 24, textAlign: "center" }}>
      <Title level={3}>Criar Evento 🎊</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Nome do Evento"
          name="name"
          rules={[{ required: true, message: "Informe o nome" }]}
        >
          <Input placeholder="Ex: Formatura Fulano" />
        </Form.Item>

        <Form.Item
          label="Url do Evento"
          name="slug"
          rules={[{ required: true, message: "Informe a Url" }]}
        >
          <Input placeholder="Ex: formatura-fulano" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Criar Evento e Gerar QR
          </Button>
        </Form.Item>
      </Form>

      {uploadUrl && (
        <div style={{ marginTop: 32 }}>
          <Title level={4}>QR Code gerado!</Title>
          <Paragraph>Escaneie para enviar fotos para este evento:</Paragraph>
          <QRCode value={uploadUrl} size={256} />
          <Paragraph copyable style={{ marginTop: 16 }}>
            {uploadUrl}
          </Paragraph>
        </div>
      )}
    </div>
    </>
  );
};

export default CreateEventPage;