**📄 MODELO DE DATOS AVANZADO - NexBid**  
** **  
   
**🔹 MICROSERVICIOS (ARQUITECTURA COMPLETA)**  
** **  
   
**1. 🔐 Auth Service**  
   
   
 **Tablas: 2**  
   
    
***users_auth (7 atributos)***  
- id (PK)  
- email  
- password_hash  
- status  
- created_at  
- updated_at  
   
    
***refresh_tokens (5 atributos)***  
- id (PK)  
- user_id  
- token  
- expires_at  
- created_at  
   
    
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNhZscVjnidKEAGFtgISaugy8zs1RkAAH9xr9VWHV9PAAB47XoAor8EPg1yCpUAAAAASUVORK5CYII=)  
   
**2. 👤 User Service**  
   
   
 **Tablas: 2**  
   
    
***users (6 atributos)***  
- id (PK)  
- name  
- email  
- phone  
- created_at  
- updated_at  
   
    
***user_profiles (5 atributos)***  
- id (PK)  
- user_id  
- avatar_url  
- bio  
- rating  
   
    
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANElEQVR4nO3OQQmAABRAsad4EjtY9fewnUms4E2ELcGWmTmrKwAA/uLeqrU6vp4AAPDa/gDzWAM6QQXRdAAAAABJRU5ErkJggg==)  
   
**3. 📦 Product Service**  
   
   
 **Tablas: 2**  
   
    
***products (7 atributos)***  
- id (PK)  
- name  
- description  
- base_price  
- owner_id  
- status  
- created_at  
   
    
***product_images (5 atributos)***  
- id (PK)  
- product_id  
- url  
- is_primary  
- created_at  
   
    
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSPBCUbfEm6YmFDBhAU2QtIq6DIzW7UHAMBfnGt1V8fXEwAAXrse/w8F7pbTa1oAAAAASUVORK5CYII=)  
   
**4. 🔥 Auction Service**  
   
   
 **Tablas: 2**  
   
    
***auctions (10 atributos)***  
- id (PK)  
- product_id  
- seller_id  
- start_price  
- current_price  
- min_increment  
- status  
- start_time  
- end_time  
- created_at  
   
    
***auction_events (6 atributos)***  
- id (PK)  
- auction_id  
- event_type  
- description  
- created_at  
- metadata (JSON)  
   
    
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsSfYxZo/kC1sYQLPJrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA4qzBdC53Vr8AAAAAElFTkSuQmCC)  
   
**5. 💥 Bid Service**  
   
   
 **Tablas: 2**  
   
    
***bids (7 atributos)***  
- id (PK)  
- auction_id  
- user_id  
- amount  
- status  
- created_at  
- updated_at  
   
    
***bid_logs (6 atributos)***  
- id (PK)  
- bid_id  
- action  
- previous_amount  
- new_amount  
- created_at  
   
    
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNhwgJWEPcbJpnRgQU2QtIq6DIze3UGAMBf3Gu1VcfXEwAAXrseaIkEMIPgIvAAAAAASUVORK5CYII=)  
   
**6. 💰 Payment Service (Simulado)**  
   
   
 **Tablas: 2**  
   
    
***payments (9 atributos)***  
- id (PK)  
- auction_id  
- user_id  
- amount  
- payment_method  
- status  
- transaction_reference  
- paid_at  
- created_at  
   
    
***payment_logs (5 atributos)***  
- id (PK)  
- payment_id  
- status  
- message  
- created_at  
   
    
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAM0lEQVR4nO3OMQ0AIAwAwdIgBKl1gjacsGCAiZDcTT9+q6oRETMAAPjF6ify6QYAADdyA9Y0AypN+bdfAAAAAElFTkSuQmCC)  
   
**7. 📊 Report Service**  
   
   
 **Tablas: 2**  
   
    
***reports (6 atributos)***  
- id (PK)  
- user_id  
- type  
- data (JSON)  
- generated_at  
- created_at  
   
    
***report_requests (5 atributos)***  
- id (PK)  
- user_id  
- report_type  
- status  
- created_at  
   
    
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAMUlEQVR4nO3WAQkAIBAEsBPMYs4PZhMDWMAA5njYUmxU1UqyAwBAF2cmeZE4AIBO7gentgXapSWpbgAAAABJRU5ErkJggg==)  
   
**⚡ SERVERLESS**  
   
**Notification Function (Cloudflare Worker)**  
   
   
 **Tablas: 0**  
   
 **Base de datos: No requiere**  
   
    
- Servicio stateless  
- Orientado a eventos  
- Procesa:  
   
   - nuevas pujas  
   
   - cierre de subastas  
   
   - notificación de ganadores  
   
    
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNhQAQ60PcrIhnxgQU2QtIq6DIze3UGAMBf3Gu1VcfXEwAAXrseS14EKxPCORkAAAAASUVORK5CYII=)  
   
**🚀 MICROSERVICIOS A IMPLEMENTAR (PARCIAL)**  
** **  
   
**🔐 Auth Service**  
   
***auth***  
- id  
- email  
- password  
- status  
- created_at  
- updated_at  
   
    
***refresh_tokens***  
- id  
- user_id  
- token  
- expires_at  
- created_at  
   
    
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAM0lEQVR4nO3OMQ0AIAwAwZIgBKm1gjSMNCwYYCIkd9OP3zJzRMQMAAB+sfqJeroBAMCN2pTWBSSZVtjzAAAAAElFTkSuQmCC)  
   
**👤 User Service**  
   
***users***  
- id  
- name  
- phone  
- created_at  
- updated_at  
   
    
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OQQmAABRAsSd4NIGBzPXBmAawhhW8ibAl2DIze3UGAMBf3Gu1VcfXEwAAXrsehaQEN+8fLHEAAAAASUVORK5CYII=)  
   
**🔥 Auction Service**  
   
***auctions***  
- id  
- product_id  
- seller_id  
- start_price  
- current_price  
- min_increment  
- status  
- start_time  
- end_time  
- created_at  
   
    
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OQQmAABRAsSfYxKK/kYXEkyk8WcGbCFuCLTOzVXsAAPzFuVZ3dXw9AQDgtesB/v8F8JQadPwAAAAASUVORK5CYII=)  
   
**💥 Bid Service**  
   
***bids***  
- id  
- auction_id  
- user_id  
- amount  
- status  
- created_at  
