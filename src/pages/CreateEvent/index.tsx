import React, { useState } from "react";
import { Button, Form, Input, Typography, notification } from "antd";
import QRCode from "react-qr-code";
import { useUser } from "../../context/UserContext";
import { createEvent, generateUniqueSlug } from "../../api/Events";
import { createEventConfig } from "../../api/EventsConfig";

const { Title, Paragraph } = Typography;

const CreateEventPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [, setSlugCreated] = useState<string | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const { user } = useUser();

  const onFinish = async (values: {
    name: string;
    time: string;
  }) => {
    setLoading(true);

    const slug = await generateUniqueSlug(values.name);
    const uploadLink = `${window.location.origin}/upload/${slug}`;

    const eventData = await createEvent({
      name: values.name,
      slug,
      upload_url: uploadLink,
      company_id: user?.company_id || "",
    });

    if (!eventData) {
      api.error({
        message: "Erro ao criar evento",
        description: "Não foi possível salvar o evento. Tente novamente.",
      });
      setLoading(false);
      return;
    }

    await createEventConfig({
      event_id: eventData.id,
      config_id: "d7e9cb3f-c588-4367-8001-947d48412382",
      value: values.time,
    });

    api.success({
      message: "Evento criado com sucesso!",
      description: "O QR Code e o link de upload já estão prontos!",
    });

    setUploadUrl(uploadLink);
    setSlugCreated(slug);
    setLoading(false);
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
          padding: 24,
          textAlign: "center",
        }}
      >
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
            label="Tempo entre fotos (segundos)"
            name="time"
            rules={[{ required: true, message: "Informe o tempo em segundos" }]}
          >
            <Input type="number" placeholder="Ex: 5" min={1} />
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