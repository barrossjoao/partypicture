import { Button, notification, Popconfirm, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  getPhotosByEventId,
  Photo,
  updatePhotoVisibility,
  deletePhotoById,
} from "../../api/Photos";
import { useParams } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash, FaTrash } from "react-icons/fa6";

const ManageGallery: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [photos, setPhotos] = useState<(Photo & { hidden?: boolean })[]>([]);
  const { eventId } = useParams();

  useEffect(() => {
    if (!eventId) return;
    const fetchPhotos = async () => {
      try {
        const data = await getPhotosByEventId(eventId);
        if (data.length > 0) {
          setPhotos(data);
        } else {
          api.error({
            message: "Nenhuma foto encontrada para este evento.",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar fotos:", error);
        api.error({
          message: "Erro ao buscar fotos.",
        });
      }
    };

    fetchPhotos();
  }, [eventId]);

  console.log(photos, "fotos");

  return (
    <>
      {contextHolder}
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
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <Tooltip title={photo.hidden ? "Mostrar foto" : "Ocultar foto"}>
                <Button
                  type="default"
                  icon={photo.hidden ? <FaRegEye /> : <FaRegEyeSlash />}
                  size="large"
                  onClick={async () => {
                    const updated = await updatePhotoVisibility(
                      photo.id,
                      photo.hidden !== true
                    );
                    if (updated) {
                      setPhotos((prev) =>
                        prev.map((p) =>
                          p.id === photo.id ? { ...p, hidden: !p.hidden } : p
                        )
                      );
                    } else {
                      api.error({
                        message: "Erro ao atualizar visibilidade da foto",
                      });
                    }
                  }}
                />
              </Tooltip>
              <Popconfirm
                title="Tem certeza que deseja excluir esta foto?"
                description="Essa ação é irreversível. A foto será removida permanentemente."
                onConfirm={async () => {
                  const deleted = await deletePhotoById(photo.id);
                  if (deleted) {
                    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
                    api.success({ message: "Foto excluída com sucesso" });
                  } else {
                    api.error({ message: "Erro ao excluir a foto" });
                  }
                }}
                okText="Sim, excluir"
                cancelText="Cancelar"
                okType="danger"
              >
                <Tooltip title="Excluir foto">
                  <Button
                    danger
                    type="primary"
                    icon={<FaTrash />}
                    size="large"
                  />
                </Tooltip>
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ManageGallery;
