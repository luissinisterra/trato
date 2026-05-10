/**
 * services.config.ts
 *
 * Centraliza las URLs de todos los microservicios.
 * Los valores se leen desde variables de entorno (.env).
 * Si una variable no está definida, se usa la URL local por defecto.
 */
export const servicesConfig = () => ({
  auth: {
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  },
  user: {
    url: process.env.USER_SERVICE_URL || 'http://localhost:3002',
  },
  auction: {
    url: process.env.AUCTION_SERVICE_URL || 'http://localhost:3003',
  },
  product: {
    url: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3004',
  },
  bid: {
    url: process.env.BID_SERVICE_URL || 'http://localhost:3005',
  },
  payment: {
    url: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3006',
  },
  report: {
    url: process.env.REPORT_SERVICE_URL || 'http://localhost:3007',
  },
});
