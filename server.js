import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

const app = express();

app.use(express.json());

// ✅ Configurá CORS para permitir tu frontend
app.use(cors({
  origin: "https://ecommerce-con-react-one.vercel.app", // dominio de tu frontend
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ⚙️ Configuración de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: "APP_USR-6406642486911375-090807-48ed1f26868df9dc88521f278cea4020-2664632384", // tu token real
});

// 🔹 Ruta para crear preferencia
app.post("/create-preference", async (req, res) => {
  try {
    const { title, price } = req.body;

    const preference = await new Preference(client).create({
      body: {
        items: [{ title, quantity: 1, unit_price: price }],
        back_urls: {
          success: "https://ecommerce-con-react-one.vercel.app/success",
          failure: "https://ecommerce-con-react-one.vercel.app/failure",
        },
        auto_return: "approved",
      },
    });

    res.json({ id: preference.id });
  } catch (error) {
    console.error("❌ Error creando preferencia:", error);
    res.status(500).json({ error: "Error al crear preferencia" });
  }
});

// 🔹 Iniciar servidor
app.listen(3000, () => console.log("🚀 Backend escuchando en puerto 3000"));
