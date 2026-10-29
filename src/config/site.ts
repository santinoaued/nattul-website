// Datos del negocio. Todo lo marcado como PLACEHOLDER se reemplaza con datos reales del cliente.

export const site = {
  name: "Nattul",
  legalName: "Nattul Almacén Natural",
  tagline: "Tu punto sano en la ciudad.",
  description:
    "Almacén natural y dietética. Frutos secos, semillas, cereales, yerba y más, a granel y envasados. Armá tu pedido y envialo por WhatsApp.",
  // Muestra el aviso de catálogo de demostración.
  demoMode: true,

  // PLACEHOLDER
  email: "contacto@ejemplo.com",

  social: {
    instagram: "https://www.instagram.com/nattul.almacennatural/",
    facebook: "https://www.facebook.com/profile.php?id=61560636547815",
  },

  branches: [
    {
      id: "sucursal-parana",
      name: "Sucursal Paraná",
      // WhatsApp en formato internacional sin "+", espacios ni guiones.
      whatsapp: "5493436124634",
      address: "Av. de las Américas 2705",
      city: "Paraná, Entre Ríos",
      // PLACEHOLDER
      hours: "Lunes a sábado, horario a confirmar",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Avenida+de+las+Am%C3%A9ricas+2705,+Paran%C3%A1,+Entre+R%C3%ADos",
      mapEmbed: "https://maps.google.com/maps?q=Avenida+de+las+Am%C3%A9ricas+2705,+Paran%C3%A1,+Entre+R%C3%ADos&z=16&hl=es&output=embed",
    },
    {
      id: "sucursal-oro-verde",
      name: "Sucursal Oro Verde",
      // WhatsApp en formato internacional sin "+", espacios ni guiones.
      whatsapp: "5493435050098",
      address: "Los Zorzales 304, esq. Los Eucaliptos",
      city: "Oro Verde, Entre Ríos",
      // PLACEHOLDER
      hours: "Lunes a sábado, horario a confirmar",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Los+Zorzales+304,+Oro+Verde,+Entre+R%C3%ADos",
      mapEmbed: "https://maps.google.com/maps?q=Los+Zorzales+304,+Oro+Verde,+Entre+R%C3%ADos&z=16&hl=es&output=embed",
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
