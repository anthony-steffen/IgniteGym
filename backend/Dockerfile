FROM node:18

# Diretório de trabalho
WORKDIR /usr/src/app

# Copia package.json e package-lock
COPY package*.json ./

# Instala dependências incluindo devDependencies
RUN npm install

# Copia o restante do projeto
COPY . .

# Compila TS → JS
RUN npm run build

# Expõe porta
EXPOSE 8080

# Comando de inicialização
CMD ["npm", "run", "start"]
