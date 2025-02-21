FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN if [ "$ENV" = "production" ]; then npm run build; fi

RUN if [ "$ENV" = "production" ]; then npm install -g serve; fi

EXPOSE 8080

CMD if [ "$NODE_ENV" = "production" ]; then \
    serve -s dist -l 8080; \
    else \
    npm run serve; \
    fi