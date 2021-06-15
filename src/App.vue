<template>
  <div id="app">
      <div class="container">
          <b-row class="justify-content-end">
              <AddNew :nextID="nextID" @addition="addition($event)"/>    <!-- add new Match component, getting ID of the next possible entry -->
          </b-row>
          <b-row>
              <DisplayData :items="items" @deletion="deletion($event)"/>   <!-- diplay for existing items component, getting processed data -->
          </b-row>
      </div>
  </div>
</template>

<script>
import DisplayData from '@/components/DisplayData.vue'
import AddNew from '@/components/AddNew.vue'

export default {
  name: 'Sportradar',
  components: {
    DisplayData,
    AddNew
  },
  data() {
    return {
      actionsProgress : {
        deleteIDs : []
      }
    }
  },
  asyncComputed: {   // simple fetch asyncComputed means if the string URL would change, auto-refech would take place
       async getMatches() {
          return await fetch(`https://widgets.fn.sportradar.com/common/en/Etc:UTC/gismo/fixtures_tournament/93581/2020`)
            .then(response => response.json())
            .then(result => result.doc[0].data)
       }
  },
  computed : {
    items() {
            let procItems = [];   
            if (this.getMatches) {    //if data is fetched, go for process
              
                for (const item in this.getMatches['matches']) {
                    procItems.push({
                        ID : this.getMatches['matches'][item]['_id'],
                        Match_Teams : '<p class="m-0">home: '+ this.getMatches['matches'][item]['teams']['home']['mediumname'] + '</p><p class="m-0">away: '+ this.getMatches['matches'][item]['teams']['away']['mediumname'] + '</p>',
                        Date : this.getMatches['matches'][item]['time']['date'],
                        Time : this.getMatches['matches'][item]['time']['time'],
                        Result : '<p class="m-0">home: '+ this.getMatches['matches'][item]['result']['home'] + '</p><p class="m-0">away: ' + this.getMatches['matches'][item]['result']['away'] + '</p>',
                        Actions : {
                          inprogress : (this.actionsProgress.deleteIDs.includes(this.getMatches['matches'][item]['_id']))   // check if entry is selected for deletion by placing its ID into "actionsProgress.deleteIDs" array, give boolean
                        }
                    });
              }
              return procItems;  // serving processed data for b-table
            }
            return null  // data is not yet fetched, giving back a null
    },

    nextID() { // calculate next possile ID for addition
      if (this.items)  // if processed list is ready
      {
        let Ids = [];
        for (const item of this.items) {
          Ids.push(item.ID)      // collect every IDs into an array
        }
        return (Math.max.apply(0, Ids)+2);   // get the highest and add 2 (following given pattern)
      } else {
        return 1;  // if processed data is not available yet, give back 1
      }
      
    }
  },

  methods: {
    deletion(event) {   // event holds entry ID
    this.actionsProgress.deleteIDs.push(event);    // placing it into "actionsProgress.deleteIDs" array
      setTimeout(() => {          // 1 second delay to simulate network operation
        this.$delete(this.getMatches['matches'], event);     // delete entry from pre-processed data (auto re-process will start)
        const index = this.actionsProgress.deleteIDs.indexOf(event);    // search item index in actionsProgress.deleteIDs" array
        if (index > -1) {
          this.actionsProgress.deleteIDs.splice(index, 1);  // and delete it
        }
      }, 1000);
    },

    addition(event) {    // event holds full object to add as entry
        this.getMatches['matches'] = {             // unify new object with existing pre-processed data (auto re-process will start)
            ...event,
            ...this.getMatches['matches']
        }    // new object is identical in structure with data from API, all the unused properties are also attached - data is ready to send for insertion
    }
  },
}
</script>

<style>

</style>
