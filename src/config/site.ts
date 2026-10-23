// Datos del negocio. Todo lo marcado como PLACEHOLDER se reemplaza con datos reales del cliente.

export const site = {
  name: "Nattul",
  legalName: "Nattul Almacén Natural",
  tagline: "Tu punto sano en la ciudad.",
  description:
    "Almacén natural y dietética. Frutos secos, semillas, cereales, yerba y más, a granel y envasados. Armá tu pedido y envialo por WhatsApp.",
  // Muestra el aviso de catálogo y precios de demostración.
  demoMode: true,

  // PLACEHOLDER: número en formato internacional sin "+", espacios ni guiones.
  whatsapp: "5490000000000",
  // PLACEHOLDER
  email: "contacto@ejemplo.com",

  social: {
    // PLACEHOLDER
    instagram: "https://www.instagram.com/",
    // PLACEHOLDER
    facebook: "https://www.facebook.com/",
  },

  branches: [
    {
      id: "sucursal-1",
      // PLACEHOLDER
      name: "Sucursal Paraná",
      address: "Dirección a confirmar",
      city: "Paraná, Entre Ríos",
      hours: "Lunes a sábado, horario a confirmar",
      // PLACEHOLDER: link de Google Maps de la sucursal.
      mapsUrl: "",
    },
    {
      id: "sucursal-2",
      // PLACEHOLDER
      name: "Sucursal Oro Verde",
      address: "Dirección a confirmar",
      city: "Oro Verde, Entre Ríos",
      hours: "Lunes a sábado, horario a confirmar",
      // PLACEHOLDER: link de Google Maps de la sucursal.
      mapsUrl: "",
    },
  ],

  // PLACEHOLDER
  deliveryZones: ["Zona de envío a confirmar"],
  // PLACEHOLDER: en pesos. 0 desactiva el mínimo.
  minimumOrder: 0,
  // PLACEHOLDER
  paymentMethods: ["Efectivo", "Transferencia"],
} as const;

export type Branch = (typeof site.branches)[number];
