<template>
    <div class="video-container">
      <div class="video-wrapper">
        <iframe
          :src="videoUrl"
          class="responsive-iframe"
          allowfullscreen
          ref="pandaPlayer"
        ></iframe>
      </div>
      <div class="controls">
        <button class="control-button" @click="playVideo">Play</button>
        <button class="control-button" @click="pauseVideo">Pause</button>
      </div>
      <p>Current time: {{ currentTime }}</p>
      <p>Status: {{ status }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentTime: 0,
        status: 'paused',
      };
    },
    props: {
      videoId: {
        type: String,
        required: true
      }
    },
    computed: {
      videoUrl() {
        return `https://player-vz-fe9765d3-df0.tv.pandavideo.com.br/embed/?v=${this.videoId}&preload=false&controls=progress,play,volume,current-time,fullscreen`;
      }
    },
    methods: {
      playVideo() {
        this.$refs.pandaPlayer.contentWindow.postMessage({ type: 'play' }, '*');
      },
      pauseVideo() {
        this.$refs.pandaPlayer.contentWindow.postMessage({ type: 'pause' }, '*');
      },
      handleMessage(event) {
        const { data } = event;
        if (data.message === 'panda_pause') {
          this.status = 'paused';
        } else if (data.message === 'panda_play') {
          this.status = 'playing';
        } else if (data.message === 'panda_timeupdate') {
          this.currentTime = data.currentTime;
        }
      }
    },
    mounted() {
      window.addEventListener('message', this.handleMessage);
    },
    beforeDestroy() {
      window.removeEventListener('message', this.handleMessage);
    }
  };
  </script>
  
  <style scoped>
.controls {
  text-align: center;
  margin-top: 15px;
}

.control-button {
  background-color: #4a148c; /* Verde */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
  border-radius: 12px; /* Bordas arredondadas */
}

.control-button:hover {
  background-color: white; 
  color: black; 
  border: 2px solid #4a148c; /* Adiciona borda quando houver hover */
}

.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Isso faz com que o contêiner ocupe a altura total da viewport. */
  flex-direction: column;
}

.video-wrapper {
  position: relative;
  width: 70%; /* Ajuste a largura do vídeo conforme necessário. */
  /* Mantém a proporção do vídeo */
  padding-top: 39.25%; /* (altura / largura) * 100 (neste caso 9 / 16 = 0.5625) */
  margin-bottom: 20px; /* Espaço entre o vídeo e os controles */
}

.responsive-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.controls {
  text-align: center;
}

</style>