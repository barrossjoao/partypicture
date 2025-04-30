import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Typography,
  notification,
} from "antd";
import QRCode from "react-qr-code";
import { useUser } from "../../context/UserContext";
import { createEvent, generateUniqueSlug } from "../../api/Events";
import { createEventConfig } from "../../api/EventsConfig";
import styles from "./styles.module.css";

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
    polaroid: boolean;
    event_date: string;
    custom_description: string;
    ai: boolean;
  }) => {
    setLoading(true);

    const slug = await generateUniqueSlug(values.name);
    const uploadLink = `${window.location.origin}/upload/${slug}`;

    const eventData = await createEvent({
      name: values.name,
      slug,
      upload_url: uploadLink,
      company_id: user?.company_id || "",
      event_date: values.event_date,
      custom_description: values.custom_description,
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

    await createEventConfig({
      event_id: eventData.id,
      config_id: "9857fbfa-8f2b-4486-9a02-aef8d16dd7e9",
      value: values.polaroid ? "true" : "false",
    });

    await createEventConfig({
      event_id: eventData.id,
      config_id: "30bf78df-9800-4d33-8959-a8d0f7c036f6",
      value: values.ai ? "true" : "false",
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
      <div className={styles.container}>
        <Title level={3}>Criar Evento 🎊</Title>

        <div className={styles.formWrapper}>
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
              rules={[
                { required: true, message: "Informe o tempo em segundos" },
              ]}
            >
              <Input type="number" placeholder="Ex: 5" min={1} />
            </Form.Item>

            <Row gutter={16}>
              <Col>
                <Form.Item name="polaroid" valuePropName="checked">
                  <Checkbox>Ativar modo Polaroid</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="ai" valuePropName="checked">
                  <Checkbox>Moderação por Inteligência Artificial</Checkbox>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Data do Evento" name="event_date">
              <Input type="date" />
            </Form.Item>

            <Form.Item label="Descrição do Evento" name="custom_description">
              <Input placeholder="Ex: Venha participar desse momento único para o Fulano" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Criar Evento e Gerar QR
              </Button>
            </Form.Item>
          </Form>
        </div>

        {uploadUrl && (
          <div className={styles.qrSection}>
            <Title level={4}>QR Code gerado!</Title>
            <Paragraph>Escaneie para enviar fotos para este evento:</Paragraph>
            <QRCode value={uploadUrl} size={256} className={styles.qrCode} />
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
