import {
  Button,
  notification,
  Popconfirm,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getPhotosByEventId,
  Photo,
  updatePhotoVisibility,
  deletePhotoById,
} from "../../api/Photos";
import { useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa6";
import { supabase } from "../../api/supabaseClient";

const { Title } = Typography;

const ManageGallery: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [photos, setPhotos] = useState<(Photo & { hidden?: boolean })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { eventId } = useParams();

  const subscribeToPhotoChanges = (eventId: string) => {
    return supabase
      .channel(`photos-changes-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "photos",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const newPhoto = payload.new as Photo;
          setPhotos((prev) => {
            if (prev.find((p) => p.id === newPhoto.id)) return prev;
            return [...prev, newPhoto];
          });
        }
      )
      .subscribe();
  };

  useEffect(() => {
    if (!eventId) return;

    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const data = await getPhotosByEventId(eventId);
        if (data.length > 0) {
          const parsed = data.map((photo) => ({
            ...photo,
            hidden: !photo.visible,
          }));
          setPhotos(parsed);
        }else {
          console.log("Nenhuma foto encontrada.");
        }
      } catch (error) {
        console.error("Erro ao buscar fotos:", error);
        api.error({ message: "Erro ao buscar fotos." });
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();

    const channel = subscribeToPhotoChanges(eventId);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  return (
    <>
      <Title level={2} style={{ marginTop: 20 }}>
        Eventos
      </Title>
      {contextHolder}
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <p>Carregando fotos...</p>
        </div>
      ) : photos.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <p>Nenhuma foto enviada ainda.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          {photos.map((photo) => (
            <div
              key={photo.id}
              style={{
                border: "1px solid #f0f0f0",
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <img
                src={photo.image_url}
                alt={`Foto ${photo.id}`}
                style={{
                  width: "100%",
                  height: "260px",
                  objectFit: "cover",
                  opacity: photo.hidden ? 0.3 : 1,
                  transition: "opacity 0.3s",
                }}
              />
              <div
                style={{
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#555" }}>
                    Exibir na galeria
                  </span>
                  <Switch
                    checked={!photo.hidden}
                    onChange={async (checked) => {
                      const updated = await updatePhotoVisibility(
                        photo.id,
                        checked
                      );
                      if (updated) {
                        setPhotos((prev) =>
                          prev.map((p) =>
                            p.id === photo.id ? { ...p, hidden: !checked } : p
                          )
                        );
                      } else {
                        api.error({
                          message: "Erro ao atualizar visibilidade da foto",
                        });
                      }
                    }}
                  />
                </div>

                <Popconfirm
                  title="Tem certeza que deseja excluir esta foto?"
                  description="Essa ação é irreversível. A foto será removida permanentemente."
                  onConfirm={async () => {
                    const deleted = await deletePhotoById(photo.id);
                    if (deleted) {
                      setPhotos((prev) =>
                        prev.filter((p) => p.id !== photo.id)
                      );
                      api.success({ message: "Foto excluída com sucesso" });
                    } else {
                      api.error({ message: "Erro ao excluir a foto" });
                    }
                  }}
                  okText="Sim, excluir"
                  cancelText="Cancelar"
                  okType="danger"
                >
                  <Tooltip title="Excluir foto da galeria">
                    <Button
                      danger
                      type="default"
                      icon={<FaTrash />}
                      size="middle"
                    >
                      Excluir
                    </Button>
                  </Tooltip>
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ManageGallery;
