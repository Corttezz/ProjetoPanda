

## Acesso à Aplicação

A aplicação está hospedada como um Web Static App na Azure e pode ser acessada através do seguinte link: [Link para aplicação na web](https://blue-flower-0eb926e03.4.azurestaticapps.net).

## Arquitetura do Projeto

### Frontend

O frontend foi construído com:

- **Vue.js**: Escolhido por sua abordagem progressiva, Vue.js é um framework JavaScript versátil que permite uma codificação eficiente e manutenção simplificada.
- **Vuetify**: Utilizamos Vuetify por sua ampla gama de componentes UI ricos e responsivos, acelerando o desenvolvimento sem sacrificar a qualidade do design.

Para uploads de vídeo, integramos o **Uppy**, um uploader de arquivos modular que oferece uma experiência de upload de arquivos superior, com controle sobre a visualização e o tipo de arquivo.

### Backend

- **Express.js**: Um framework web rápido, flexível e minimalista para Node.js, facilitando a criação de APIs robustas e a integração com o frontend.
- **PostgreSQL**: Optamos pelo PostgreSQL devido à sua robustez, capacidade de lidar com grandes volumes de dados e recursos avançados de segurança e integridade de dados.

### Hospedagem na Azure

- A aplicação está hospedada na Azure, aproveitando a confiabilidade e escalabilidade que a plataforma oferece.
- O servidor backend reside em uma máquina virtual da Azure, garantindo isolamento de recursos e performance consistente.
- O banco de dados está hospedado no serviço "Servidores do Banco de Dados do Azure para PostgreSQL", proporcionando backups automatizados, fácil escalabilidade e alta disponibilidade.

## Configuração do Projeto

Para começar, clone o repositório em sua máquina local e siga os passos abaixo.

### Instalação de Dependências
```
npm install
```

### Compilação e hot-reloads para desenvolvimento
```
npm run serve
```

### Compilação e minificação para produção
```
npm run build
```

### Lints e correções de arquivos
```
npm run lint
```

### Personalização da Configuração
Para detalhes adicionais sobre a configuração do projeto, consulte a [Referência de Configuração](https://cli.vuejs.org/config/).

