# Etapa 1: Build de Angular
FROM node:18 AS build-stage

WORKDIR /app

# Copiar el proyecto Angular
COPY gestionTiendaOnline/ .

# Instalar dependencias
RUN npm install

# Dar permisos de ejecución al CLI de Angular
RUN chmod +x node_modules/.bin/ng

# Compilar la app Angular en modo producción
RUN npx ng build --configuration=production

#  Etapa 2: Servir con Nginx
FROM nginx:stable-alpine AS production-stage

# Elimina la configuración por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia los archivos compilados de Angular
#COPY --from=build-stage /app/dist/Camper /usr/share/nginx/html
COPY --from=build-stage /app/dist/Camper/browser /usr/share/nginx/html

# Copia configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
RUN chmod -R 755 /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
