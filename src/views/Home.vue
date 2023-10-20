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
                    <v-col cols="12" md="8" >
                      <v-card-text class="mt-12">
                        <h1 class="text-center display-2 purple--text text--darken-4">Criar Conta</h1>

                        <div class="text-center mt-4">
                          
                        </div>
                        <h4 class="text-center mt-4">Certifique-se de seu e-mail para registro</h4>
                        <v-form>
                          <v-text-field
                            label="E-mail"
                            name="E-mail"
                            prepend-icon="email"
                            type="text"
                            color="purple darken-4"
                          />

                          <v-text-field
                            id="password"
                            label="Senha"
                            name="senha"
                            prepend-icon="lock"
                            type="password"
                            color="purple darken-4"
                          />
                        </v-form>
                        <h3 class="text-center mt-4">Esqueceu sua senha?</h3>
                      </v-card-text>
                      <div class="text-center mt-3">
                        <v-btn rounded color="purple darken-4" dark>ENTRAR</v-btn>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4" class="purple darken-4">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">Olá, Amigo!</h1>
                        <h5
                          class="text-center"
                        >Insira seus dados pessoais e comece sua jornada conosco</h5>
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
                        <h5
                          class="text-center"
                        >Para permanecer conectado conosco, faça o login com suas informações pessoais</h5>
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
                        <h4 class="text-center mt-4">Certifique-se de seu e-mail para registro</h4>
                        <v-form>
                          <v-text-field
                            label="Nome"
                            name="Nome"
                            prepend-icon="person"
                            type="text"
                            color="purple darken-4"
                          />
                          <v-text-field
                            label="E-mail"
                            name="E-mail"
                            prepend-icon="email"
                            type="text"
                            color="purple darken-4"
                          />

                          <v-text-field
                            id="password"
                            label="Senha"
                            name="senha"
                            prepend-icon="lock"
                            type="password"
                            color="purple darken-4"
                          />
                        </v-form>
                      </v-card-text>
                      <div class="text-center mt-n5">
                        <v-btn rounded color="purple darken-4" dark>CADASTRAR-SE</v-btn>
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
  </v-app>
</template>

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
