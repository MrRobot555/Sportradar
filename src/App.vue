<template>
  <div id="app">
    <div class="container">
      <b-row class="justify-content-end">
        <AddNew :next-i-d="nextID" @addition="addition($event)" />
      </b-row>
      <b-row>
        <DisplayData :items="items" @deletion="deletion($event)" />
      </b-row>
    </div>
  </div>
</template>

<script>
import DisplayData from "@/components/DisplayData.vue";
import AddNew from "@/components/AddNew.vue";

export default {
  name: "Sportradar",
  components: {
    DisplayData,
    AddNew
  },
  data() {
    return {
      actionsProgress: {
        deleteIDs: []
      }
    };
  },

  asyncComputed: {
    async getMatches() {
      return await fetch(
        `https://widgets.fn.sportradar.com/common/en/Etc:UTC/gismo/fixtures_tournament/93581/2020`
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Something went wrong at fetching data.");
          }
        })
        .then(result => result.doc[0].data)
        .catch(error => {
          console.log(error);
        });
    }
  },

  computed: {
    items() {
      let procItems = [];
      if (this.getMatches) {
        for (const item in this.getMatches["matches"]) {
          procItems.push({
            ID: this.getMatches["matches"][item]["_id"],
            Match_Teams:
              '<p class="m-0">home: ' +
              this.getMatches["matches"][item]["teams"]["home"]["mediumname"] +
              '</p><p class="m-0">away: ' +
              this.getMatches["matches"][item]["teams"]["away"]["mediumname"] +
              "</p>",
            Date: this.getMatches["matches"][item]["time"]["date"],
            Time: this.getMatches["matches"][item]["time"]["time"],
            Result:
              '<p class="m-0">home: ' +
              this.getMatches["matches"][item]["result"]["home"] +
              '</p><p class="m-0">away: ' +
              this.getMatches["matches"][item]["result"]["away"] +
              "</p>",
            Actions: {
              inprogress: this.actionsProgress.deleteIDs.includes(
                this.getMatches["matches"][item]["_id"]
              )
            }
          });
        }
        return procItems;
      }
      return null;
    },

    nextID() {
      if (this.items) {
        let Ids = [];
        for (const item of this.items) {
          Ids.push(item.ID);
        }
        return Math.max.apply(0, Ids) + 2;
      } else {
        return 1;
      }
    }
  },

  methods: {
    deletion(event) {
      this.actionsProgress.deleteIDs.push(event);
      setTimeout(() => {
        this.$delete(this.getMatches["matches"], event);
        const index = this.actionsProgress.deleteIDs.indexOf(event);
        if (index > -1) {
          this.actionsProgress.deleteIDs.splice(index, 1);
        }
      }, 1000);
    },

    addition(event) {
      this.getMatches["matches"] = {
        ...event,
        ...this.getMatches["matches"]
      };
    }
  }
};
</script>

<style></style>
