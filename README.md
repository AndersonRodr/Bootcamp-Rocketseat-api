# Bootcamp-Rocketseat-api

==> Executar o projeto: yarn dev

Instalações necessárias:
1. Instalar o Chocolatey pelo cmd;
2. Instalar Nodejs via gerenciador de pacotes
	- Usar chocolatey no power shell: cinst nodejs;
3. Instalar o yarn;
	- choco install yarn
4. Entrar na pasta do projeto e executar:
	- npm init ou yarn init -y
5. Instalar Express:
	- yarn add express
6. Servidor Nodemon:
	- yarn add sucrase nodemon -D(dependência de desenvolvedor)
	- criar script de execução em package.json

7. Sequelize:
	- yarn add sequelize
	- yarn add sequelize-cli -D
	- yarn add pg pg-hstore
	- yarn sequelize migration:create --name=create-tabela
	- yarn sequelize db:migrate

8. Hash de senha:
	- yarn add bcryptjs

9. Autenticação:
	- yarn add jsonwebtoken

10. Validação de campos:
	- yarn add yup

11. Upload de imagens:
	- yarn add multer

12. Trabalhar com datas:
	- yarn add date-fns@next

13. Mongoose:
	- yarn add mongoose

14. Envio de email:
	- yarn add nodemailer
	- Mailtrap

15. Template para o email enviado:
	- yarn add express-handlebars (integração do express com handlebars)
	- yarn add nodemailer-express-handlebars (integração do nodemailer com handlebars)

16. Redis - Banco chave-valor para aumentar o tempo do email enviado:
	- docker run --name NAME -p 6379:6379 -d -t redis:alpine
	- yarn add bee-queue (controlador de filas do node)

17. Sentry (monitoramento de falhas):
	- sentry io
	- yarn add @sentry/node@VERSION
	- yarn add express-async-errors
	- yarn add youch

18. Variáveis Ambiente:
	- yarn add dotenv
