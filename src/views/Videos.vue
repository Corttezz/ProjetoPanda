<template>
  <v-container>
    <!-- Seção de Upload -->
    <v-row class="my-3">
      <v-col>
        <v-btn
  id="upload-button" 
  color="purple darken-4"
  dark

>
  <v-icon left>mdi-upload</v-icon>
  Upload de Vídeo
</v-btn>

      </v-col>
    </v-row>

    <!-- Lista de Vídeos -->
    <v-row>
      <v-col
        v-for="video in videos"
        :key="video.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-hover v-slot:default="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            class="mx-auto"
            max-width="344"
            link
          >
            <video
              controls
              class="video-preview"
              :src="video.url"
              @click.stop=""
            ></video>

            <v-card-title>{{ video.title }}</v-card-title>
            <v-card-subtitle>{{ video.description }}</v-card-subtitle>

            <v-card-actions>
              <v-btn
                icon
                @click="onEditVideo(video)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                @click="onDeleteVideo(video)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="https://releases.transloadit.com/uppy/v1.29.1/uppy.min.js"></script>
<script>
import axios from 'axios'; // importe o axios
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Tus from '@uppy/tus';
import { v4 as uuidv4 } from 'uuid';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css'

export default {
  name: 'Videos',
  data() {
    return {
      videos: [], // Deve ser preenchido com dados reais, possivelmente de uma API
      uppy: null,
      user: null, // para armazenar os dados do usuário
    };
  },
  async mounted() {
    try {
      // substitua 'userId' pelo ID real do usuário
      const userId = localStorage.getItem('userId'); // ou outra forma de obter o userId
      const response = await axios.get(`http://192.168.15.31:3000/users/${userId}`);
      this.user = response.data.user;

      this.uppy = new Uppy()
        .use(Dashboard, {
          trigger: '#upload-button', // Este é o elemento que, quando clicado, abrirá o Dashboard do Uppy
          inline: false, // Isso fará com que o painel apareça como um modal
        })
        .use(Tus, {
          endpoint: 'https://uploader-us01.pandavideo.com.br/files/',
          resume: true,
          limit: 1
        });

      this.uppy.on('file-added', (file) => {
        this.uppy.setFileMeta(file.id, {
          authorization: 'panda-f3c410ff76dad651c9834316eaa3cf45725ae97abc2162ad9abbe01b170c44e5',
          folder_id: this.user.library_id, // use o library_id do usuário
          // preciusa ser uuiv4 preciso gerar isso video_id: com uuidv4(),
          
        });
      });

      this.uppy.on('complete', (result) => {
        console.log('Upload completo! Resultado:', result);
        // Aqui você pode adicionar lógica para fazer algo com o resultado, como adicionar o vídeo à lista
      });
    } catch (error) {
      console.error('Houve um erro ao buscar os dados do usuário ou inicializar o Uppy', error);
    }
  },
  beforeDestroy() {
    if (this.uppy) {
      this.uppy.close();
    }
  },
  methods: {
    onEditVideo(video) {
      // Implemente a lógica de edição aqui
      console.log('Editando vídeo:', video);
    },
    onDeleteVideo(video) {
      // Implemente a lógica de exclusão aqui
      console.log('Excluindo vídeo:', video);
    },
  },
};
</script>


<style scoped>
.video-preview {
  width: 100%;
  max-height: 300px; /* Ajuste conforme necessário */
  object-fit: cover; /* Isso fará com que o vídeo se ajuste ao container */
}
</style>
