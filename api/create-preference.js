import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-6406642486911375-090807-48ed1f26868df9dc88521f278cea4020-2664632384", // tu token real
});

export default async function handler(req, res) {
  // ✅ Permitir CORS
  res.setHeader("Access-Control-Allow-Origin", "https://ecommerce-con-react-one.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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

    return res.status(200).json({ id: preference.id });
  } catch (error) {
    console.error("❌ Error creando preferencia:", error);
    return res.status(500).json({ error: "Error al crear la preferencia" });
  }
}
