<template>
    <div>
        <!-- Button to start the live stream -->
        <div v-if="!responseReceived && !loading" style="background-color: #4a148c; ">
            <p style="color: white; font-size: 20px; padding: 4%;">Você consegue inciar sua live por aqui!</p>
        </div>
        <div v-if="!responseReceived && !loading"
            style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh;">

            <div v-if="!responseReceived">
                <p style="color: black; font-size: 20px; padding: 4%; text-align: center;">Você está offline, selecione "Start Live" para começar sua transmissão.</p>
            </div>

            <button v-if="!responseReceived" @click="startLive" class="start-button">Start Live</button>

        </div>
        <!-- Loading state -->
        <div v-if="loading" style="display: flex; justify-content: center; align-items: center; height: 50vh;">
            <v-progress-circular indeterminate color="purple darken-4"></v-progress-circular>
        </div>
        <!-- Live stream details and player -->
        <div v-if="responseReceived" class="live-details" style="background-color: #4a148c;">

            <!-- RTMP and Stream Key -->
            <div class="info-container" style="background-color: #4a148c ; padding: 3%;">
                <div class="info">
                    <!-- RTMP -->
                    <div class="col col-12" style="background-color: #4a148c; width: 360px;">
                        <div
                            class="v-input v-input--hide-details v-input--is-label-active v-input--is-dirty v-input--is-readonly v-input--dense theme--dark v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined">
                            <div class="v-input__control">
                                <div class="v-input__slot">
                                    <fieldset aria-hidden="true">
                                        <legend style="width: 0;"></legend>
                                    </fieldset>
                                    <div class="v-text-field__slot">
                                        <label for="rtmp-input" class="v-label v-label--active theme--dark"
                                            style="left: 0px; right: auto; position: absolute;">URL de stream</label>
                                        <input id="rtmp-input" readonly="readonly" type="text" :value="rtmp">
                                    </div>
                                    <div class="v-input__append-inner">
                                        <button type="button" aria-haspopup="true" aria-expanded="false"
                                            class="v-icon notranslate v-icon--link mdi mdi-content-copy theme--dark"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Stream Key -->
                    <div class="col col-12" style="background-color: #4a148c;">
                        <div
                            class="v-input v-input--hide-details v-input--is-label-active v-input--is-dirty v-input--is-readonly v-input--dense theme--dark v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined">
                            <div class="v-input__control">
                                <div class="v-input__slot">
                                    <fieldset aria-hidden="true">
                                        <legend style="width: 0;"></legend>
                                    </fieldset>
                                    <div class="v-text-field__slot">
                                        <label for="streamkey-input" class="v-label v-label--active theme--dark"
                                            style="left: 0px; right: auto; position: absolute;">Chave de stream</label>
                                        <input id="streamkey-input" readonly="readonly" type="text" :value="streamKey">
                                    </div>
                                    <div class="v-input__append-inner">
                                        <button type="button" aria-haspopup="true" aria-expanded="false"
                                            class="v-icon notranslate v-icon--link mdi mdi-content-copy theme--dark"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="end-live-button">
                        <button @click="endLive" class="end-button">Finalizar Live</button>
                    </div>
            </div>
        </div>

        <div v-if="responseReceived" style="position:relative;padding-top:75%; flex: 1;">
            <iframe :id="'panda-' + liveId" :src="liveUrl"
                style="border:none;position:absolute;top:0;left:0;width:100%;height:100%;"
                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture" allowfullscreen=true
                fetchpriority="high"></iframe>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Live',
    data() {
        return {
            rtmp: '',
            streamKey: '',
            liveId: '',
            liveUrl: '',
            responseReceived: false,
            loading: false, // adicionado estado de carregamento
        };
    },
    methods: {
        async startLive() {
            this.loading = true; // ativado quando o usuário clica no botão
            try {
                const response = await fetch("https://api-v2.pandavideo.com.br/live", {
                    method: "POST",
                    headers: {
                        'Authorization': 'panda-f3c410ff76dad651c9834316eaa3cf45725ae97abc2162ad9abbe01b170c44e5',
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({ title: "Live" })
                });

                if (response.ok) {
                    const data = await response.json();
                    this.rtmp = data.rtmp;
                    this.streamKey = data.stream_key;
                    this.liveId = data.id;
                    this.liveUrl = data.live_player;
                    this.responseReceived = true;
                } else {
                    // eslint-disable-next-line no-console
                    console.error("Failed to start live. Response:", response.statusText);
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error starting live:", error);
            } finally {
                this.loading = false; // desativado quando a chamada é concluída, seja com sucesso ou erro
            }
        },
        async endLive() {
            try {
                const response = await fetch(`https://api-v2.pandavideo.com.br/live/${this.liveId}/finish`, {
                    method: "POST",
                    headers: {
                        'Authorization': 'panda-f3c410ff76dad651c9834316eaa3cf45725ae97abc2162ad9abbe01b170c44e5',
                        'accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // eslint-disable-next-line no-console
                    console.log("Live has been ended:", data);
                    this.responseReceived = false;
                } else {
                    // eslint-disable-next-line no-console
                    console.error("Failed to end live. Response:", response.statusText);
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error ending live:", error);
            }
        }
    }
}
</script>

<style scoped>

@media screen and (max-width: 560px) {
    .info-container {
        flex-direction: column-reverse !important
    }

    .end-live-button {
        width: 100% !important;
        margin-top: 10px !important
    }

    .info {
        width: 100% !important
    }
    .end-button {
        position: static !important
    }
}

.start-button {
    background-color: #4a148c;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: 20px;
}

.start-button:hover {
    background-color: #370a7a;
}

.live-details {
    display: flex;
    gap: 20px;
    align-items: center;
}

.info {
    justify-content: center;
    align-items: center;
}

.end-button {
    position: absolute;
    background-color: red;
    top: 6%;
    right: 5%;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.end-button:hover {
    background-color: darkred;
}

.v-label {
    font-size: 18px;
}

.v-icon {
    font-size: 24px;
}

.info-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.end-live-btn {
    background-color: red;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.end-live-btn:hover {
    background-color: darkred;
}

@media screen and (max-width: 768px) {
    .info-container {
        flex-direction: column;
    }

    .end-live-btn {
        margin-top: 15px;
    }
}
</style>
