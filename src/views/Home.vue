<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="8">
            <v-card class="elevation-12">
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1 class="text-center display-2 purple--text text--darken-4">Entrar</h1>

                        <div class="text-center mt-4">

                        </div>
                        <p class="text-center mt-4">Certifique-se de seu e-mail para registro está correto.</p>
                        <v-form>
                          <v-text-field label="E-mail" name="E-mail" prepend-icon="email" type="text"
                            color="purple darken-4" v-model="email" />

                          <v-text-field id="password" label="Senha" name="senha" prepend-icon="lock" type="password"
                            color="purple darken-4" v-model="password" />
                        </v-form>
                        <h3 class="text-center mt-4">Esqueceu sua senha?</h3>
                      </v-card-text>
                      <div class="text-center mt-3">
                        <v-btn rounded color="purple darken-4" dark @click="login">ENTRAR</v-btn>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4" class="purple darken-4">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">Olá, Amigo!</h1>
                        <p class="text-center">Insira seus dados pessoais e comece sua jornada conosco</p>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded outlined dark @click="step++">CADASTRE-SE</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
                <v-window-item :value="2">
                  <v-row class="fill-height">
                    <v-col cols="12" md="4" class="purple darken-4">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">Bem-vindo de Volta!</h1>
                        <p class="text-center">Para permanecer conectado conosco, faça o login com suas informações
                          pessoais</p>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded outlined dark @click="step--">Entrar</v-btn>
                      </div>
                    </v-col>

                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1 class="text-center display-2 purple--text text--darken-4">Criar Conta</h1>
                        <div class="text-center mt-4">
                        </div>
                        <p class="text-center mt-4">Certifique-se de colocar credenciais válidas.</p>
                        <v-form>
                          <v-text-field label="Nome" name="Nome" prepend-icon="person" type="text" color="purple darken-4"
                            v-model="name" />
                          <v-text-field label="E-mail" name="E-mail" prepend-icon="email" type="text"
                            color="purple darken-4" v-model="email" />

                          <v-text-field id="password" label="Senha" name="senha" prepend-icon="lock" type="password"
                            color="purple darken-4" v-model="password" />
                        </v-form>
                      </v-card-text>
                      <div class="text-center mt-n5">
                        <v-btn rounded color="purple darken-4" dark @click="register">CADASTRAR-SE</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
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
    <v-dialog v-model="registerSuccessDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Cadastro bem-sucedido!</v-card-title>
        <v-card-text>Seu cadastro foi realizado com sucesso. Por favor, faça login para continuar.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="purple darken-4" dark @click="redirectToLogin">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style scoped>
.v-application,
.text-center.display-1,
/* Alvo da classe display-1 */
.text-center.display-2,
/* Alvo da classe display-2 */
h1,
h4,
h5 {
  /* Alvo de elementos de título específicos */
  font-family: 'Poppins', sans-serif !important;
  /* !important para garantir que sobrescreva outros estilos */
}
</style>
<script>
export default {
  data: () => ({
    step: 1
  }),
  props: {
    source: String
  }
};
</script>

<script>
import api from '@/services/api';

export default {
  data: () => ({
    step: 1,
    email: '',
    password: '',
    name: '',
    dialog: false, // controla a visibilidade do modal
    dialogTitle: '', // título do modal
    dialogMessage: '', // mensagem do modal
    registerSuccessDialog: false, // controla a visibilidade do diálogo de sucesso no cadastro
  }),
  methods: {
    showErrorModal(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      this.dialog = true;
    },
    async register() {
      try {
        const response = await api.post('/users/register', {
          email: this.email,
          password: this.password,
          name: this.name
        });
        console.log(response.data);
        // Se o cadastro foi bem-sucedido, mostre o diálogo de sucesso
        this.registerSuccessDialog = true;
      } catch (error) {
        console.error("Erro ao registrar:", error.response.data);
        // Aqui, você pode querer mostrar um modal de erro ou outra forma de notificação
        this.showErrorModal('Erro no Registro', error.response.data.message || 'Ocorreu um erro desconhecido.');
      }
    },
    redirectToLogin() {
      this.step = 1; // muda para a etapa da tela de login
      this.registerSuccessDialog = false; // fecha o diálogo
    },
    closeDialog() {
      this.dialog = false;
      if (this.dialogTitle === 'Cadastro bem-sucedido!') {
        this.redirectToLogin(); // Redireciona para o login se o registro foi bem-sucedido
      }
    },
    async login() {
      try {
        const response = await api.post('/users/login', {
          email: this.email,
          password: this.password
        });
        console.log(response.data);
        localStorage.setItem('userToken', response.data.token); 
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        // guardar user id
        localStorage.setItem('userId', response.data.userId);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error("Erro ao fazer login:", error.response.data);
        // Exibe o modal de erro
        this.showErrorModal('Erro no Login', error.response.data.message || 'Ocorreu um erro desconhecido.');
      }
    }
  }
};
</script>