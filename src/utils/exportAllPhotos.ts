import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * Baixa e compacta imagens de um array de URLs em um único arquivo ZIP.
 * @param imageUrls Array de URLs das imagens
 * @param zipName Nome do arquivo zip final
 */
export async function downloadPhotosAsZip(imageUrls: string[], zipName = "fotos_evento.zip") {
  const zip = new JSZip();

  const fetchImage = async (url: string, index: number) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro ao baixar imagem ${index + 1}`);
    const blob = await response.blob();
    zip.file(`foto_${index + 1}.jpg`, blob);
  };

  await Promise.all(imageUrls.map((url, i) => fetchImage(url, i)));

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, zipName);
}