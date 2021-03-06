<template>
  <v-app>
    <v-app-bar app color="blue">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="white--text">Twitter tracker</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text class="white--text mr-2" to="/app/analytics">
        <v-icon left>mdi-chart-areaspline</v-icon>
        Analytics
      </v-btn>
      <v-btn text class="white--text mr-2" to="/app/gallery">
        <v-icon left>mdi-folder-multiple-image</v-icon>
        Gallery
      </v-btn>
      <v-btn text class="white--text mr-2" to="/app/dashboard">
        <v-icon left>mdi-view-dashboard</v-icon>
        Dashboard
      </v-btn>
      <v-btn text class="white--text" to="/app/filter">
        <v-icon left>mdi-plus-circle</v-icon>
        new sample
      </v-btn>
    </v-app-bar>

    <v-footer absolute>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              rounded
              color="primary"
              dark
              fixed
              bottom
              right
              href="https://t.me/tt202014_bot"
              v-bind="attrs"
              v-on="on"
          >
            <v-icon dark left>
              mdi-telegram
            </v-icon>
            BOT TELEGRAM
          </v-btn>
        </template>
        <span>Contact the bot telegram to receive notifications of the events that interest you</span>
      </v-tooltip>
    </v-footer>

    <v-navigation-drawer app v-model="drawer" bottom>
      <h3 class="pa-3">Samples List</h3>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item
          v-for="item in samplesList"
          :key="item"
          @click="selectSample(item)"
        >
            <v-list-item-content>
              <v-list-item-title v-text="item"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      icon
                      :disabled="!isSampleActive( item )"
                      @click="pauseSample(item)"
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon>mdi-pause</v-icon>
                  </v-btn>
                </template>
                <span>Pause</span>
              </v-tooltip>
            </v-list-item-action>
            <v-list-item-action>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      icon
                      :disabled="isSampleActive( item )"
                      @click="activeSample(item)"
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon>mdi-play</v-icon>
                  </v-btn>
                </template>
                <span>Resume</span>
              </v-tooltip>
            </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="grey lighten-3">
      <v-container fluid>
        <router-view
            :selectedSampleTag="selectedSampleTag"
            :selectedSample="selectedSample"
            :localSample="localSample"
            :localFilter="localFilter"
            @update-samples="updateSampleList()"
            @setLocalSample="localSample = $event"
            @setLocalFilter="localFilter = $event"
        ></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import {StatusCodes} from "http-status-codes";
import Filter from "@/js/Filter";

export default {
  name: "MainPage",

  data: () => ({
    selectedSample: null,
    selectedSampleTag: null,
    drawer: true,
    overlay: true,
    samples: {
      active: [],
      paused: []
    },
    localSample: null,
    localFilter: new Filter()
  }),
  computed: {
    samplesList() {
      return this.samples.active.concat( this.samples.paused );
    }
  },
  watch: {
    selectedSample(newVal) {
      this.localSample = newVal;
      this.localFilter = new Filter();
    }
  },
  created() {
    this.updateSampleList();
  },
  methods: {
    selectSample(item) {
      axios.get('/api/samples/' + item)
          .then( (response) => {
            console.log("Select sample", item);
            this.selectedSample = response.data;
            this.selectedSampleTag=item;
          })
          .catch( (error) => {
            console.error("ERROR", error);
          })
    },
    updateSampleList() {
      axios.get("/api/samples/")
          .then( (response) => {
            let data = response.data;
            this.samples.active = data.active || [];
            this.samples.paused = data.paused || [];
          })
          .catch( (err) => {
            console.error( err );
          });
    },
    isSampleActive( name ) {
      return this.samples.active.includes( name );
    },
    pauseSample(name) {
      axios.post(`/api/samples/${name}/pause`)
        .then( (data) => {
          this.samples.active = data.active || [];
          this.samples.paused = data.paused || [];
        })
        .catch( (err) => {
          console.error( err );
          switch( err.response.status ) {
            case StatusCodes.METHOD_NOT_ALLOWED: {
              break;
            }
          }
        })
        .finally( () => {
          this.updateSampleList();
        })

    },
    activeSample(name) {
      axios.post(`/api/samples/${name}/resume`)
        .then( (data) => {
          this.samples.active = data.active || [];
          this.samples.paused = data.paused || [];
        })
        .catch( (err) => {
          console.error( err );
        })
      .finally( () => {
          this.updateSampleList();
        })
    }
  }
}
</script>

<style scoped>

</style>