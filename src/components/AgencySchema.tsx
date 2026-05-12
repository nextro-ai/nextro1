import React from 'react';

const AgencySchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Nextro",
    "url": "https://nextro.agency",
    "logo": "https://nextro.agency/logo.png",
    "image": "https://nextro.agency/images/portfolio-main.jpg",
    "description": "Agencia creativa de alto nivel enfocada en renders 3D arquitectónicos, marketing y mejora de imagen mediante Inteligencia Artificial (Upscaling).",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Buenos Aires",
      "addressCountry": "AR"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios Premium Nextro",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Renders 3D Arquitectónicos y de Producto"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Image Upscaling & Remasterización Visual"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Marketing Digital Integral"
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default AgencySchema;
