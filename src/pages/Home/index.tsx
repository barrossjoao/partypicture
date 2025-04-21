import React, { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { Card, List, Typography, Spin } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;

interface Event {
  id: string;
  name: string;
  slug: string;
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("id, name, slug")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar eventos:", error);
    } else {
      setEvents(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Title level={2}>Eventos Criados</Title>

      {loading ? (
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
                  <strong>Url:</strong> {event.slug}
                </p>
                <p>
                  <Link to={`/upload/${event.slug}`}>🔼 Enviar Fotos</Link>
                </p>
                <p>
                  <Link to={`/gallery/${event.slug}`}>🖼️ Ver Galeria</Link>
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