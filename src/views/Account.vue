<template>
  <v-container fluid class="pa-0 d-flex justify-center align-center" style="min-height: 100vh;">
    <v-card class="elevation-2" style="max-width: 500px; width: 100%;">
      <v-toolbar dark flat color="purple darken-4">
        <v-toolbar-title>Perfil</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeProfile">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-content class="font-weight-medium">Nome</v-list-item-content>
            <v-list-item-content>
              <v-text-field ref="name" v-model="editableFields.name" :disabled="!editing" label="Nome"></v-text-field>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="toggleEdit('name')">
                <v-icon color="purple darken-4">mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-content class="font-weight-medium">E-mail</v-list-item-content>
            <v-list-item-content>
              <v-text-field ref="email" v-model="editableFields.email" :disabled="!editing" label="E-mail"></v-text-field>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="toggleEdit('email')">
                <v-icon color="purple darken-4">mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-content class="font-weight-medium">Senha</v-list-item-content>
            <v-list-item-content>
              <v-text-field ref="password" v-model="editableFields.password" :disabled="!editing" label="Senha" type="password"></v-text-field>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="toggleEdit('password')">
                <v-icon color="purple darken-4">mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-btn dark color="purple darken-4" :disabled="!editing || loading" @click="updateAccount">
          <v-progress-circular indeterminate color="white" size="24" class="mr-2" v-if="loading" />
          Salvar
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Modal de erro -->
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
        <v-card-text>{{ dialogMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="purple darken-4" text @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      editing: false,
      userDetails: {},
      editableFields: {
        name: '',
        email: '',
        password: ''
      },
      dialog: false,
      dialogTitle: 'Erro',
      dialogMessage: '',
      loading: false,
    };
  },
  methods: {
    toggleEdit(field) {
      this.editing = !this.editing;
      if (!this.editing) {
        this.editableFields = { ...this.userDetails };
      } else {
        this.$nextTick(() => {
          this.$refs[field].focus();
        });
      }
    },
    validateFields() {
      if (this.editableFields.name.length < 3) {
        this.dialogMessage = 'O nome deve ter pelo menos 3 caracteres.';
        this.dialog = true;
        return false;
      }
      if (!this.editableFields.email.includes('@')) {
        this.dialogMessage = 'Insira um e-mail válido.';
        this.dialog = true;
        return false;
      }
      if (this.editableFields.password.length < 6) {
        this.dialogMessage = 'A senha deve ter pelo menos 6 caracteres.';
        this.dialog = true;
        return false;
      }
      return true;
    },
    async updateAccount() {
      if (!this.validateFields()) {
        return;
      }
      this.loading = true;
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID não encontrado');
        }

        const updatedFields = {};
        for (const field in this.editableFields) {
          if (this.editableFields[field] !== this.userDetails[field]) {
            updatedFields[field] = this.editableFields[field];
          }
        }

        if (Object.keys(updatedFields).length === 0) {
          this.dialogMessage = 'Nenhuma alteração detectada nos campos.';
          this.dialog = true;
          return;
        }

        const response = await axios.put(`https://projetopanda-webapp.azurewebsites.net/users/${userId}`, { updateData: updatedFields });

        if (response.status === 200) {
          this.userDetails = { ...this.editableFields };
          this.editing = false;
          this.dialogTitle = 'Sucesso';
          this.dialogMessage = 'Perfil atualizado com sucesso!';
          this.dialog = true;
        } else {
          throw new Error('Erro ao atualizar o perfil.');
        }
      } catch (error) {
        this.dialogMessage = error.message || 'Erro ao atualizar o perfil.';
        this.dialog = true;
      } finally {
        this.loading = false;
      }
    },
    closeProfile() {
      // Lógica para fechar o perfil ou navegar para fora
    }
  },
  async mounted() {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID não encontrado');
      }

      const response = await axios.get(`https://projetopanda-webapp.azurewebsites.net/users/${userId}`);
      this.userDetails = response.data.user;
      this.editableFields = { ...this.userDetails };
    } catch (error) {
      this.dialogMessage = 'Erro ao carregar os detalhes do usuário.';
      this.dialog = true;
    }
  }
}
</script>

<style scoped>

</style>
