import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Spin,
  Avatar,
  Input,
  Row,
  Col,
  Select,
  notification,
  Pagination,
  Button,
} from "antd";
import { Link } from "react-router-dom";
import { getEventsByCompanyId } from "../../api/Events";
import { useUser } from "../../context/UserContext";
import { FiCopy, FiDownload, FiImage, FiUpload } from "react-icons/fi";
import { BiQrScan } from "react-icons/bi";
import { downloadPhotosAsZip } from "../../utils/exportAllPhotos";
import { getPhotosByEventId } from "../../api/Photos";
import styles from "./styles.module.css";

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
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [loading, setLoading] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();

  const { user } = useUser();

  useEffect(() => {
    if (user?.company_id) {
      const fetchEvents = async () => {
        try {
          setLoading(true);
          const data = await getEventsByCompanyId(user.company_id);
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
    <>
      {contextHolder}
      <div>
        <div className={styles.header}>
          <Title level={2} className={styles.title}>
            Eventos
          </Title>

          <div className={styles.filters}>
            <Search
              placeholder="Pesquisar por nome"
              allowClear
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: "200px" }}
            />
            <Select
              value={pageSize}
              onChange={(value) => setPageSize(value)}
              style={{ width: "200px" }}
            >
              <Option value={12}>12 por página</Option>
              <Option value={24}>24 por página</Option>
              <Option value={30}>30 por página</Option>
              <Option value={36}>36 por página</Option>
              <Option value={filteredEvents.length}>Todos</Option>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <Spin />
          </div>
        ) : filteredEvents.length === 0 ? (
          <p>Nenhum evento encontrado.</p>
        ) : (
          <div className={styles.grid}>
            {paginatedEvents.map((event) => (
              <div key={event.id} className={styles.cardItem}>
                <Card
                  title={
                    <div className={styles.cardTitle}>
                      <Avatar style={{ backgroundColor: "#1677ff" }}>
                        {getInitials(event.name)}
                      </Avatar>
                      <Link to={`/edit-event/${event.id}`}>{event.name}</Link>
                    </div>
                  }
                >
                  <Row gutter={[8, 12]}>
                    <Col span={12}>
                      <Link to={`/upload/${event.slug}`}>
                        <FiUpload style={{ marginRight: 8 }} />
                        Enviar Fotos
                      </Link>
                    </Col>
                    <Col span={12}>
                      <Link to={`/gallery/${event.slug}`}>
                        <FiImage style={{ marginRight: 8 }} />
                        Ver Galeria
                      </Link>
                    </Col>
                    <Col span={12}>
                      <Link to={`/qrcode/${event.slug}`}>
                        <BiQrScan style={{ marginRight: 8 }} />
                        Ver QR Code
                      </Link>
                    </Col>
                    <Col span={12}>
                      <Link to={`/manage-gallery/${event.id}`}>
                        <FiImage style={{ marginRight: 8 }} />
                        Editar Galeria
                      </Link>
                    </Col>
                    <Col span={12}>
                      <Button
                        type="link"
                        icon={<FiCopy />}
                        onClick={async () => {
                          try {
                            const link = `${window.location.origin}/gallery/${event.slug}`;
                            await navigator.clipboard.writeText(link);
                            api.success({
                              message: "Link copiado!",
                              description:
                                "O link da galeria foi copiado para a área de transferência.",
                            });
                          } catch {
                            api.error({
                              message: "Erro ao copiar link",
                              description:
                                "Não foi possível copiar o link para a área de transferência.",
                            });
                          }
                        }}
                        style={{
                          padding: 0,
                          height: "auto",
                          wordBreak: "break-word", 
                          whiteSpace: "normal",    
                          textAlign: "left",    
                        }}
                      >
                        Copiar Link da Galeria
                      </Button>
                    </Col>
                    <Col span={12}>
                      <a
                        href="#"
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            const photos = await getPhotosByEventId(event.id);
                            const urls = photos.map((photo) => photo.image_url);
                            if (urls.length === 0) {
                              api.error({
                                message: "Nenhuma foto encontrada",
                                description:
                                  "Não há fotos disponíveis para download.",
                              });
                              return;
                            }
                            await downloadPhotosAsZip(
                              urls,
                              `${event.name}-fotos.zip`
                            );
                          } catch {
                            api.error({
                              message: "Erro ao baixar fotos",
                              description:
                                "Ocorreu um erro ao tentar baixar as fotos.",
                            });
                          }
                        }}
                      >
                        <FiDownload style={{ marginRight: 8 }} />
                        Baixar Fotos
                      </a>
                    </Col>
                  </Row>
                </Card>
              </div>
            ))}
          </div>
        )}
        <div className={styles.pagination}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredEvents.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ textAlign: "center", marginTop: 24 }}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
