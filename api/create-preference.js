import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-6406642486911375-090807-48ed1f26868df9dc88521f278cea4020-2664632384",
});

export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://ecommerce-con-react-one.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ✅ Preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 🚫 Bloquear cualquier otro método que no sea POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { title, price } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: "Faltan datos del producto" });
    }

    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            title,
            quantity: 1,
            unit_price: Number(price),
          },
        ],
        back_urls: {
          success: "https://ecommerce-con-react-one.vercel.app/success",
          failure: "https://ecommerce-con-react-one.vercel.app/failure",
        },
        auto_return: "approved",
      },
    });

    return res.status(200).json({ id: preference.id });
  } catch (error) {
    console.error("❌ Error al crear la preferencia:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
