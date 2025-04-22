import React, { useEffect, useState } from "react";
import {
  Card,
  List,
  Typography,
  Spin,
  Avatar,
  Input,
  Row,
  Col,
  Select,
} from "antd";
import { Link } from "react-router-dom";
import { getEventsByCompanyId } from "../../api/Events";
import { useUser } from "../../context/UserContext";
import { FiImage, FiUpload } from "react-icons/fi";
import { BiQrScan } from "react-icons/bi";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Event {
  id: string;
  name: string;
  slug: string;
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    if (user?.company_id) {
      const fetchEvents = async () => {
        try {
          setLoading(true);
          const data = await getEventsByCompanyId(user.company_id);
          console.log(data, 'data');
          setEvents(data);
          setFilteredEvents(data);
        } catch (error) {
          console.error("Erro ao buscar eventos:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchEvents();
    }
  }, [user?.company_id]);

  useEffect(() => {
    if (searchValue.length >= 3) {
      const filtered = events.filter((event) =>
        event.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
    setCurrentPage(1); 
  }, [searchValue, events]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ marginTop: 20 }}>
            Eventos Criados
          </Title>
        </Col>
        <Col style={{ display: "flex", gap: 16 }}>
          <Search
            placeholder="Pesquisar por nome"
            allowClear
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            value={pageSize}
            onChange={(value) => setPageSize(value)}
            style={{ width: 120 }}
          >
            <Option value={12}>12 por página</Option>
            <Option value={24}>24 por página</Option>
            <Option value={30}>30 por página</Option>
            <Option value={36}>36 por página</Option>
            <Option value={filteredEvents.length}>Todos</Option>
          </Select>
        </Col>
      </Row>

      { loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin />
        </div>
      ) : filteredEvents.length === 0 ? (
        <p>Nenhum evento encontrado.</p>
      ) : (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={paginatedEvents}
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredEvents.length,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
          renderItem={(event) => (
            <List.Item>
              <Card
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <Avatar style={{ backgroundColor: "#1677ff" }}>
                      {getInitials(event.name)}
                    </Avatar>
                    <span>{event.name}</span>
                  </div>
                }
              >
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