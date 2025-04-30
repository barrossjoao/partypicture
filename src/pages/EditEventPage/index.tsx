import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Spin,
  Typography,
  notification,
} from "antd";
import { useUser } from "../../context/UserContext";
import styles from "./styles.module.css";
import { useParams } from "react-router-dom";
import {
  generateUniqueSlug,
  getEventById,
  updateEvent,
} from "../../api/Events";
import {
  getAiConfigEventByEventId,
  getPolaroidConfigEventByEventId,
  getTimeConfigEventByEventId,
  updateAiConfigEventByEventId,
  updatePolaroidConfigEventByEventId,
  updateTimeConfigEventByEventId,
} from "../../api/EventsConfig";

const { Title } = Typography;

interface Events {
  id: string;
  name: string;
  slug: string;
  upload_url: string;
  company_id: string;
  time?: number;
  polaroid?: boolean;
  event_date?: string;
  custom_description?: string;
}

const EditEventPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();
  const [, setEvent] = useState<Events | null>(null);
  const { user } = useUser();
  const { eventId } = useParams();
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const event = await getEventById(eventId || "");
      if (!event) {
        return api.error({
          message: "Evento não encontrado",
          description: "O evento que você está tentando editar não existe.",
        });
      }

      setEvent(event);

      const [timeConfig, polaroidConfig, aiConfig] = await Promise.all([
        getTimeConfigEventByEventId(eventId || ""),
        getPolaroidConfigEventByEventId(eventId || ""),
        getAiConfigEventByEventId(eventId || ""),
      ]);

      const timeValue = timeConfig ? parseInt(timeConfig) : 5;
      const polaroidValue = polaroidConfig === "true";
      const aiValue = aiConfig === "true";

      form.setFieldsValue({
        name: event.name,
        time: timeValue.toString(),
        polaroid: polaroidValue,
        event_date: event.event_date
          ? new Date(event.event_date).toISOString().split("T")[0]
          : undefined,
        custom_description: event.custom_description || "",
        ai: aiValue,
      });

      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      api.error({
        message: "Erro ao buscar evento",
        description: "Houve um erro ao buscar o evento e suas configurações.",
      });
    }
  };

  useEffect(() => {
    if (!user || !eventId) return;
    fetchData();
  }, [user, eventId]);

  const onFinish = async (values: {
    name: string;
    time: string;
    polaroid: boolean;
    event_date: string;
    custom_description: string;
    ai: boolean;
  }) => {
    if (!eventId) return;

    setLoading(true);

    try {
      const newSlug = await generateUniqueSlug(values.name);
      const uploadLink = `${window.location.origin}/upload/${newSlug}`;

      const updated = await updateEvent(eventId, {
        name: values.name,
        slug: newSlug,
        upload_url: uploadLink,
        event_date: values.event_date,
        custom_description: values.custom_description,
      });

      if (!updated) {
        api.error({
          message: "Erro ao atualizar evento",
          description: "Não foi possível atualizar o evento.",
        });
        return;
      }

      const timeUpdated = await updateTimeConfigEventByEventId(
        eventId,
        parseInt(values.time)
      );

      if (!timeUpdated) {
        api.error({
          message: "Erro ao atualizar configuração de tempo",
          description: "Não foi possível atualizar a configuração de tempo.",
        });
        return;
      }
      const polaroidUpdated = await updatePolaroidConfigEventByEventId(
        eventId,
        values.polaroid
      );

      if (!polaroidUpdated) {
        api.error({
          message: "Erro ao atualizar configuração de polaroid",
          description: "Não foi possível atualizar a configuração de polaroid.",
        });
        return;
      }

      const aiUpdated = await updateAiConfigEventByEventId(
        eventId,
        values.ai
      );

      if (!aiUpdated) {
        api.error({
          message: "Erro ao atualizar configuração de AI",
          description: "Não foi possível atualizar a configuração de AI.",
        });
        return;
      }

      api.success({
        message: "Evento atualizado com sucesso",
      });
    } catch (err) {
      console.error("Erro no onFinish:", err);
      api.error({
        message: "Erro inesperado",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : (
        <div className={styles.container}>
          <Title level={3}>Editar Evento 🎊</Title>

          <div className={styles.formWrapper}>
            <Form layout="vertical" form={form} onFinish={onFinish}>
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

              <Form.Item label="Descrição" name="custom_description">
                <Input 
                  placeholder="Descrição personalizada do evento"
                  />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  {loading ? "Atualizando..." : "Atualizar Evento"}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditEventPage;
