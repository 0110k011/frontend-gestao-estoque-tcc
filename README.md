# A.2 Instruções para execução do frontend

## Passo 1 - Clonar o repositório

git clone git@github.com:0110k011/frontend-gestao-estoque-tcc.git
ou
git clone https://github.com/0110k011/frontend-gestao-estoque-tcc.git

## Passo 2 - Instalar as dependências

npm install

## Passo 3 - Configurar a URL da API

Crie um arquivo .env.local na raiz do projeto com o seguinte conteúdo:
VITE_API_URL=http://localhost:8080

Esse arquivo não é versionado (está no .gitignore) e permite que o mesmo código-fonte seja utilizado em diferentes ambientes sem alterações.

## Passo 4 - Iniciar o servidor de desenvolvimento

npm run dev

O frontend estará disponível em http://localhost:5173. O backend deve estar em execução simultânea para que a comunicação funcione.

