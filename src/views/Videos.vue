<template>
  <v-container>
    <!-- Seção de Upload -->
    <v-row class="my-3">
      <v-col class="d-flex align-center">
        <v-btn id="upload-button" color="purple darken-4" dark>
          <v-icon left>mdi-upload</v-icon>
          Upload de Vídeo
        </v-btn>
      </v-col>
      <v-col class="d-flex align-center justify-end">
        <span class="font-weight-bold">Qtd. de vídeos: {{ videos.length }}</span>
      </v-col>
    </v-row>

    <!-- Indicador de Carregamento -->
    <div v-if="loading" class="loader-overlay">
      <v-progress-circular indeterminate color="purple darken-2" size="40"></v-progress-circular>
    </div>

    <!-- Mensagem quando não há vídeos -->
    <v-row v-if="videos.length === 0" class="text-center align-center justify-center" style="height: 100vh;">
      <v-col>
        <p>Você ainda não tem vídeos, clique em "Upload de Vídeo" para começar.</p>
        <v-img src="../assets/logo.png" alt="logo" max-width="300" class="mx-auto" style="opacity: 0.3;"></v-img>
      </v-col>
    </v-row>


    <!-- Lista de Vídeos -->
    <v-row>
      <v-col v-for="video in videos" :key="video.id" cols="12" sm="6" md="4">
        <v-hover v-slot:default="{ hover }">
          <v-card :elevation="hover ? 12 : 2" class="mx-auto" max-width="344" link>
            <div style="position:relative;padding-top:56.25%;">
              <iframe :id="`panda-${video.id}`"
                :src="`https://player-vz-fe9765d3-df0.tv.pandavideo.com.br/embed/?v=${video.video_external_id}&preload=false`"
                style="border:none;position:absolute;top:0;left:0;" width="100%" height="100%"></iframe>

            </div>


            <v-card-title>{{ video.title }}</v-card-title>
            <v-card-subtitle :class="statusClass(video.status)">{{ statusText(video.status) }}</v-card-subtitle>
            <v-card-text>
              {{ video.video_id }}
            </v-card-text>


            <v-card-actions>
              <v-btn icon @click="onEditVideo(video)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="onDeleteVideo(video)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-dialog v-model="confirmDeleteDialog" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">Confirmar exclusão</v-card-title>
        <v-card-text>
          Você tem certeza que deseja excluir este vídeo?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>


<script>

import axios from 'axios';
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
      loading: true,
      videos: [],
      uppy: null,
      user: null,
      confirmDeleteDialog: false,
      selectedVideo: null,
      pollingInterval: null
    };
  },
  async mounted() {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      const response = await axios.get(`https://projetopanda-webapp.azurewebsites.net/users/${userId}`);
      this.user = response.data.user;

      this.uppy = new Uppy()
        .use(Dashboard, {
          trigger: '#upload-button',
          inline: false,
        })
        .use(Tus, {
          endpoint: 'https://uploader-us01.pandavideo.com.br/files/',
          resume: true,
          limit: 1
        });

      this.uppy.on('file-added', (file) => {
        const video_id = uuidv4();
        this.uppy.setFileMeta(file.id, {
          authorization: 'panda-f3c410ff76dad651c9834316eaa3cf45725ae97abc2162ad9abbe01b170c44e5',
          folder_id: this.user.library_id,
          video_id,
        });
      });

      this.uppy.on('complete', async (result) => {
        this.loading = true;
        const successfulUploads = result.successful || [];
        for (const file of successfulUploads) {
          try {
            const videoDetails = await this.fetchVideoDetails(file.meta.video_id);

            await axios.post('https://projetopanda-webapp.azurewebsites.net/library', {
              userId: userId,
              videoId: file.meta.video_id,
              videoExternalId: videoDetails.video_external_id,
              status: 'DRAFT', // Definindo o status inicial como DRAFT
              title: file.name,
              libraryId: this.user.library_id,
            });

            const newVideo = {
              videoId: file.meta.video_id,
              id: file.meta.video_id,
              url: videoDetails.url,
              video_external_id: videoDetails.video_external_id,
              title: file.name,
              description: videoDetails.description,
              status: 'DRAFT', // Aqui também, asseguramos que o status inicial é DRAFT
            };
            this.videos.push(newVideo);

            this.monitorVideoStatus(file.meta.video_id, this.user.library_id);
            await this.loadVideos(userId);

          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Erro ao enviar dados para a biblioteca ou ao recuperar detalhes do vídeo:', error);
          }

        }
        this.loading = false;
      });

      await this.loadVideos(userId);
      this.startPolling(); 
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro na montagem:', error);
    }
    clearInterval(this.pollingInterval);
  },
  beforeDestroy() {
    if (this.uppy) {
      this.uppy.close();
    }
  },
  methods: {
    startPolling() {
      this.pollingInterval = setInterval(async () => {
        await this.loadVideos(localStorage.getItem('userId'));
      }, 10000); // A cada 10 segundos, por exemplo.
    },
    onEditVideo(video) {
      // eslint-disable-next-line no-console
      console.log('Editando vídeo:', video);
    },
    onDeleteVideo(video) {
      this.selectedVideo = video;
      this.confirmDeleteDialog = true;
    },
    confirmDelete() {
      this.deleteVideo(this.selectedVideo);
      this.confirmDeleteDialog = false;
      this.selectedVideo = null;
    },

    statusClass(status) {
      if (status === 'CONVERTED') {
        return 'status-converted';
      } else if (status === 'DRAFT') {
        return 'status-draft';
      }
      return '';
    },
    statusText(status) {
      switch (status) {
        case 'DRAFT':
          return 'Convertendo...';
        case 'CONVERTED':
          return 'Convertido';
        default:
          return status; // ou outro texto padrão que você queira mostrar
      }
    },

    async loadVideos(userId) {
      this.loading = true;
      try {
        const response = await axios.get(`https://projetopanda-webapp.azurewebsites.net/library/user/${userId}`);
        // eslint-disable-next-line no-console
        console.log('Loaded videos:', response.data);
        this.videos = response.data;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erro ao carregar vídeos:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchVideoDetails(videoId, maxAttempts = 3, delay = 2000) {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const response = await axios.get(`https://api-v2.pandavideo.com.br/videos/${videoId}`, {
            headers: {
              'Authorization': 'panda-f3c410ff76dad651c9834316eaa3cf45725ae97abc2162ad9abbe01b170c44e5',
              'accept': 'application/json'
            }
          });
          // eslint-disable-next-line no-console
          console.log('Video details:', response.data);

          // Se a solicitação for bem-sucedida e os dados forem recebidos, retorne os dados
          return response.data;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Tentativa ${attempt + 1} de buscar detalhes do vídeo falhou: `, error);

          // Se esta foi a última tentativa, rejeite a promessa
          if (attempt + 1 === maxAttempts) {
            throw new Error(`Falha ao buscar detalhes do vídeo após ${maxAttempts} tentativas`);
          }

          // Aguarde antes de tentar novamente
          await new Promise(res => setTimeout(res, delay));
        }
      }
    },
    async deleteVideo(video) {
      try {
        // Excluir do backend local
        await axios.delete(`https://projetopanda-webapp.azurewebsites.net/library/${video.video_id}`);

        // Excluir do servidor Panda Video
        await axios({
          method: 'DELETE',
          url: 'https://api-v2.pandavideo.com.br/videos',
          headers: {
            'Authorization': 'panda-f3c410ff76dad651c9834316eaa3cf45725ae97abc2162ad9abbe01b170c44e5', // Certifique-se de usar a autenticação correta aqui
            'accept': 'application/json',
            'content-type': 'application/json',
          },
          data: [
            {
              "video_id": video.video_id
            }
          ],
        });

        // Remover o vídeo da lista local
        this.videos = this.videos.filter(v => v.id !== video.id);

      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erro ao excluir vídeo:', error);
      }
    },
    async monitorVideoStatus(videoId, libraryId, interval = 30000, timeout = 3600000) {
      // eslint-disable-next-line no-console
      console.log('Starting video status monitoring for videoId:', videoId);

      const startTime = new Date();

      const checkStatus = async () => {
        if (new Date() - startTime > timeout) {
          // eslint-disable-next-line no-console
          console.error('Timeout exceeded while waiting for CONVERTED status');
          return;
        }

        try {
          const response = await axios.get(`https://api-v2.pandavideo.com.br/videos/${videoId}`, {
            headers: {
              'Authorization': 'panda-f3c410ff76dad651c9834316eaa3cf45725ae97abc2162ad9abbe01b170c44e5',
              'accept': 'application/json'
            }
          });

          const videoDetails = response.data;
          // eslint-disable-next-line no-console
          console.log('Current video status:', videoDetails.status);

          if (videoDetails.status === 'CONVERTED') {
            // eslint-disable-next-line no-console
            console.log('Video converted, updating database.');

            const updateResponse = await axios.put(`https://projetopanda-webapp.azurewebsites.net/library/${videoId}`, {
              status: 'CONVERTED',
              videoExternalId: videoDetails.video_external_id,
            });
            // eslint-disable-next-line no-console
            console.log('Database update response:', updateResponse.data);

            // Aqui é onde atualizamos o status do vídeo no frontend
            const index = this.videos.findIndex(v => v.id === videoId);
            if (index !== -1) {
              this.$set(this.videos, index, {
                ...this.videos[index],
                status: 'CONVERTED'
              });
            }
          } else {
            // eslint-disable-next-line no-console
            console.log(`Current status: ${videoDetails.status}. Re-checking in ${interval}ms.`);
            setTimeout(checkStatus, interval);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error checking video status:', error);
          setTimeout(checkStatus, interval);
        }
      };

      checkStatus();
    }
  },
};
</script>


<style scoped>
.v-content {
  padding-left: 0px !important
}

.status-converted {
  color: green !important;
}

.status-draft {
  color: red !important;
}

.video-preview {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
}

.loader-overlay {
  position: fixed;
  /* Fixo em relação à janela do navegador */
  top: 6%;
  /* Posicionado na metade da tela verticalmente */
  left: 58%;
  /* Posicionado na metade da tela horizontalmente */
  transform: translate(-50%, -50%);
  /* Desloca o elemento para trás pela metade de sua largura e altura */
  z-index: 9999;
  /* Certifique-se de que está no topo */
}
</style>
