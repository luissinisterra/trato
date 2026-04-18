# 🚀 Trato - Sistema de Subastas con Microservicios

Trato es una plataforma de subastas digitales donde los usuarios pueden publicar productos y competir mediante pujas en tiempo real.  
El sistema está diseñado con arquitectura de microservicios y un componente serverless orientado a eventos.

---

## 🧠 Características principales

- 🔐 Autenticación con JWT + Refresh Tokens
- 👤 Gestión de usuarios
- 📦 Publicación de productos
- 🔥 Subastas con control de tiempo y estados
- 💥 Sistema de pujas con validaciones
- 💰 Procesamiento de pagos (simulado)
- 📊 Reportes e historial
- ⚡ Notificaciones event-driven (serverless)

---

## 🏗️ Arquitectura

El sistema está compuesto por:

### 🔹 API Gateway
Punto de entrada único para todos los clientes.

---

### 🔹 Microservicios

- Auth Service
- User Service
- Product Service
- Auction Service
- Bid Service
- Payment Service (simulado)
- Report Service

---

### ⚡ Serverless

- Notification Function (Cloudflare Workers)

---

## 🧩 Diagrama lógico

```plaintext
Cliente
   ↓
API Gateway
   ↓
[Auth] [User] [Product] [Auction] [Bid] [Payment] [Report]
   ↓
(Eventos)
   ↓
Notification Function (Serverless)
