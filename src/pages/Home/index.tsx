import React, { useEffect, useState } from "react";
import { Card, List, Typography, Spin } from "antd";
import { Link } from "react-router-dom";
import { getEventsByCompanyId } from "../../api/Events";
import { useUser } from "../../context/UserContext";
import { FiImage, FiUpload } from "react-icons/fi";
import { BiQrScan } from "react-icons/bi";

const { Title } = Typography;

interface Event {
  id: string;
  name: string;
  slug: string;
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    if (user && user.company_id) {
      const fetchEvents = async () => {
        try {
          const data = await getEventsByCompanyId(user.company_id);
          setEvents(data);
        } catch (error) {
          console.error("Erro ao buscar eventos:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEvents();
    }
  }, [user]);

  return (
    <div>
      <Title level={2}>Eventos Criados</Title>

      {userLoading || loading ? (
        <Spin />
      ) : events.length === 0 ? (
        <p>Nenhum evento criado ainda.</p>
      ) : (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={events}
          renderItem={(event) => (
            <List.Item>
              <Card title={event.name}>
                <p>
                  <strong>Name:</strong> {event.name}
                </p>
                <p>
                  <strong>URL:</strong> {event.slug}
                </p>
                <p>
                  <Link to={`/upload/${event.slug}`}>
                    <FiUpload style={{ marginRight: 8 }} />
                    Enviar Fotos
                  </Link>
                </p>
                <p>
                  <Link to={`/gallery/${event.slug}`}>
                    <FiImage style={{ marginRight: 8 }} />
                    Ver Galeria
                  </Link>
                </p>
                <p>
                  <Link to={`/qrcode/${event.slug}`}>
                    <BiQrScan style={{ marginRight: 8 }} />
                    Ver QR Code
                  </Link>
                </p>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Home;
