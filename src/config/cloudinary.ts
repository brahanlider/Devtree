import { v2 as cloudinary } from "cloudinary";

// CLOUDINARY_URL=cloudinary://774334678645399:BQkcuVHDxYh729NlkPjLu3q5TlM@diniomdqz

(async function () {
  // Configuración
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Haga clic en "Ver claves API" arriba para copiar su secreto de API.
  });

  // Subir una imagen
  const uploadResult = await cloudinary.uploader
    .upload(
      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {
        public_id: "shoes",
      }
    )
    .catch((error) => {
      console.log(error);
    });

  console.log(uploadResult);

  // Optimizar la entrega redimensionando y aplicando formato y calidad automáticos
  const optimizeUrl = cloudinary.url("shoes", {
    fetch_format: "auto",
    quality: "auto",
  });

  console.log(optimizeUrl);

  // Transformar la imagen: recortar automáticamente a una relación de aspecto cuadrada
  const autoCropUrl = cloudinary.url("shoes", {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  });

  console.log(autoCropUrl);
})();

export default cloudinary;
