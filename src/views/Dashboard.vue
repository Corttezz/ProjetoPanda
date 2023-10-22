<template>
    <v-app>
      <v-navigation-drawer app permanent width="250" color="purple darken-4" dark>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="white--text">Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
  
          <v-list-item 
            v-for="item in menuItems" 
            :key="item.title" 
            link 
            :to="item.link"
            :active-class="item.activeClass"
            exact
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
  
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
  
      <v-content>
        <router-view></router-view>
      </v-content>
    </v-app>
  </template>
  
  <script>
  import api from '@/services/api'; // Certifique-se de importar sua instância axios configurada
  
  export default {
    data() {
      return {
        user: null, // vamos armazenar os dados do usuário aqui
        menuItems: [
          { title: 'Vídeos', icon: 'mdi-video', link: '/dashboard/videos', activeClass: 'active-item' },
          { title: 'Conta', icon: 'mdi-account', link: '/dashboard/account', activeClass: 'active-item' },
        ],
      };
    },
    async created() {
  try {
    const userId = localStorage.getItem('userId'); // ou de onde quer que você armazene o ID do usuário após o login
    const response = await api.get(`/users/${userId}`); // use o ID do usuário na URL
    this.user = response.data.user; // ajuste conforme a estrutura da sua resposta
     // eslint-disable-next-line no-console
    console.log(this.user); // exibir os dados do usuário no console
  } catch (error) {
     // eslint-disable-next-line no-console
    console.error("Erro ao recuperar dados do usuário:", error);
  }
    },
  };
 
  </script>
  
  <style scoped>
  .v-content {
  padding-left: 4% !important
}
  .active-item {
    background-color: rgba(255, 255, 255, 0.2) !important; /* Cor de fundo quando o item está ativo */
  }
  </style>
  