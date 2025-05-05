FROM node:22.11.0-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install -g @angular/cli@latest --legacy-peer-deps
RUN npm install --legacy-peer-deps
RUN npx ngcc --properties es2023 browser modules main --first-only --create-ivy-entry-points

COPY . .

RUN npm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

COPY --from=build /app/dist/retry-front/browser /usr/share/nginx/html/browser

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
