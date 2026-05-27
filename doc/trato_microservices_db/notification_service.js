/**
 * Notification Service — MongoDB Schema (Mongoose)
 *
 * Database: trato_notifications
 * Collection: notifications
 */

/*
  Document shape:

  {
    _id: ObjectId,
    user_id: String,            // UUID del usuario destino
    type: String,              // enum de tipos de notificación
    title: String,             // Título corto
    message: String,           // Mensaje descriptivo
    metadata: {                // Objeto genérico
      auctionId: String,
      bidId: String,
      amount: Number,
      productId: String,
      ...
    },
    read: Boolean,             // false por defecto
    created_at: Date,          // auto por Mongoose
    updated_at: Date           // auto por Mongoose
  }

  Indexes:
    - { user_id: 1, read: 1 }            → filtrar no leídas por usuario
    - { user_id: 1, created_at: -1 }     → listar notificaciones por usuario

  Tipos de notificación:
    OUTBID         → Alguien superó tu puja
    WINNING        → Tu puja va ganando
    AUCTION_ENDING → La subasta termina pronto
    AUCTION_WON    → Ganaste la subasta
    AUCTION_LOST   → Perdiste la subasta
    LOGIN_ALERT    → Nuevo inicio de sesión
    AUCTION_CREATED → Tu subasta fue publicada
    BID_CREATED    → Nueva puja registrada
    BID_ACCEPTED   → Tu puja fue aceptada
    BID_REJECTED   → Tu puja fue rechazada
    AUCTION_STARTED → Subasta iniciada
    AUCTION_CLOSED  → Subasta cerrada
*/
