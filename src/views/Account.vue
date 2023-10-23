<template>
  <v-container fluid class="pa-0  d-flex justify-center align-center" style="min-height: 100vh;">
    <v-card class="elevation-2" style="max-width: 500px; width: 100%;">
      <v-toolbar dark flat color="purple darken-4">
        <v-toolbar-title>Perfil</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-content class="font-weight-medium">Nome</v-list-item-content>
            <v-list-item-content class="font-weight-medium">{{ userDetails.name }}</v-list-item-content>
            <v-list-item-action>
              <v-icon class="primary--text">mdi-pencil</v-icon>
            </v-list-item-action>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-content class="font-weight-medium">E-mail</v-list-item-content>
            <v-list-item-content class="font-weight-medium">{{ userDetails.email }}</v-list-item-content>
            <v-list-item-action>
              <v-icon class="primary--text">mdi-pencil</v-icon>
            </v-list-item-action>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-content class="font-weight-medium">Senha</v-list-item-content>
            <v-list-item-content class="font-weight-medium">********</v-list-item-content> <!-- Nunca exiba senhas em texto claro -->
            <v-list-item-action>
              <v-icon class="primary--text">mdi-pencil</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'; // Certifique-se de ter instalado o Axios via npm

export default {
  data() {
    return {
      userDetails: {
        email: '',
        name: '',
        password: '' // Não é recomendado manter a senha em texto claro no estado do componente
      }
    };
  },
  methods: {
    // ... seus outros métodos ...
  },
  async mounted() {
    try {
      const userId = localStorage.getItem('userId'); // Obter o userId do localStorage
      if (!userId) {
        throw new Error('User ID não encontrado');
      }

      // Fazendo a requisição GET para buscar os dados do usuário
      const response = await axios.get(`https://projetopanda-webapp.azurewebsites.net/users/${userId}`); // Substitua com a URL base correta do seu backend

      // Atualizando userDetails com os dados recebidos
      this.userDetails = response.data.user;
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar os detalhes do usuário.');
    }
  }
}
</script>

<style scoped>
/* estilos específicos para a página da conta */
</style>
