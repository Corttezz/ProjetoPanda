<template>
  <v-app>
    <!-- Botão de menu para dispositivos móveis -->
    <v-app-bar v-if="!drawer" app color="purple darken-4">
      <v-app-bar-nav-icon color='white' @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="white--text">Dashboard</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" width="250" color="purple darken-4" dark mobile-breakpoint="960">
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

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import api from '@/services/api'; // Certifique-se de importar sua instância axios configurada

export default {
  data() {
    return {
      drawer: true, // Controle para a visibilidade do menu
      user: null, 
      menuItems: [
        { title: 'Vídeos', icon: 'mdi-video', link: '/dashboard/videos', activeClass: 'active-item' },
        { title: 'Conta', icon: 'mdi-account', link: '/dashboard/account', activeClass: 'active-item' },
        { title: 'Live', icon: 'mdi-access-point', link: '/dashboard/live', activeClass: 'active-item' },
      ],
    };
  },
  async created() {
    try {
      const userId = localStorage.getItem('userId'); 
      const response = await api.get(`/users/${userId}`); 
      this.user = response.data.user; 
      // eslint-disable-next-line no-console
      console.log(this.user); 
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Erro ao recuperar dados do usuário:", error);
    }
  },
};
</script>

<style scoped>
.v-main {
  padding: 0% !important;
}

.active-item {
  background-color: rgba(255, 255, 255, 0.2) !important; 
}

/* Estilos para dispositivos móveis */
@media (max-width: 960px) {
  .v-main {
    padding-left: 0 !important; /* Remover o padding lateral para dispositivos móveis */
    padding-top: 0 !important
  }
}

</style>
