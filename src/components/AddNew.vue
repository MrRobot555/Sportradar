<template>
    <div>   
            <b-button v-b-modal.newmatch-modal class="my-2" size="lg" variant="primary">+ match</b-button>   <!-- button to open modal -->

            <b-modal 
              id="newmatch-modal" 
              title="Add a new match"
              ref="newmatch-modal"    
              @show="resetModal"   
              @hidden="resetModal"
              @ok="handleOk"
              scrollable             
            >     <!-- call reset modal on show, hide, and submit events, modal is scrollable -->
                <form ref="form" @submit.stop.prevent="handleSubmit">       <!--  form with handle method -->

                  <b-form-group           
                    label="Name of Home Team"
                    label-for="team-home-name"
                    :invalid-feedback="invalidFeedback(newMatch.teams.home.mediumname)"
                    valid-feedback="Tank you!"
                  >   <!-- text input field with simple validation methods -->
                    <b-form-input
                      id="team-home-name"
                      v-model="newMatch.teams.home.mediumname"
                      :state="nameState(newMatch.teams.home.mediumname)"
                      required
                      >
                    </b-form-input>
                  </b-form-group>

                  <b-form-group
                    label="Name of Away Team"
                    label-for="team-away-name"
                    :invalid-feedback="invalidFeedback(newMatch.teams.away.mediumname)"
                    valid-feedback="Tank you!"
                  >   <!-- text input field with simple validation methods -->
                    <b-form-input
                      id="team-away-name"
                      v-model="newMatch.teams.away.mediumname"
                      :state="nameState(newMatch.teams.away.mediumname)"
                      required
                      >
                    </b-form-input>
                  </b-form-group>

                  <b-form-group
                    label="Set date and time for the Match"
                    label-for="match-date-time"
                    class="my-5"
                  >  <!-- date picker with external library (v-calendar) -->
                    <v-date-picker is-expanded id="match-date-time" v-model="date" mode="dateTime" :is24hr="format24h" :timezone="timezone" />
                  </b-form-group>


                  <b-form-group
                    label="Please set result for first half of the Match (HOME : AWAY)"
                    :valid-feedback="valNumFeed"
                    :invalid-feedback="invNumFeed"
                    class="form-inline"
                  >  <!-- number input field with simple validation methods -->
                    <b-form-input
                      id="result-first-half-home"
                      type="number"
                      v-model="newMatch.periods.p1.home"
                      required
                      min="0"
                      class="resultWidth"
                      :state="nameStateNum(newMatch.periods.p1.home)"
                      >
                    </b-form-input>
                    <span> : </span>
                    <b-form-input
                      id="result-first-half-away"
                      type="number"
                      v-model="newMatch.periods.p1.away"
                      required
                      min="0"
                      class="resultWidth"
                      :state="nameStateNum(newMatch.periods.p1.away)"                   
                      >
                    </b-form-input>
                  </b-form-group>

                  <b-form-group
                    label="Please set final result of the Match (HOME : AWAY)"
                    :valid-feedback="valNumFeed"
                    :invalid-feedback="invNumFeed"
                    class="form-inline"
                  >  <!-- number input field with simple validation methods -->
                    <b-form-input
                      id="result-final-home"
                      type="number"
                      v-model="newMatch.result.home"
                      required
                      @input="includeResult"
                      min="0"
                      class="resultWidth"
                      :state="nameStateNum(newMatch.result.home)"
                      >
                    </b-form-input>
                    <span> : </span>
                    <b-form-input
                      id="result-final-away"
                      type="number"
                      v-model="newMatch.result.away"
                      required
                      @input="includeResult"
                      min="0"
                      class="resultWidth"
                      :state="nameStateNum(newMatch.result.away)"
                      >
                    </b-form-input>
                  </b-form-group>

                </form>
            </b-modal>
    </div>
</template>

<script>
export default {
  props : {
      nextID : {
        type : Number,
        required : true
      }
  },

    data() {
       return {
          newMatch : {},
          date: new Date(),
          timezone: 'utc',
          format24h: true,
          validity : null,
          invNumFeed : 'Enter numbers between 0-10 only!',
          valNumFeed : 'Tank you!'
       }
    },

    watch: {
      date: {   //call process Date object when inpit updates
        handler: function(){
          this.$set(this.newMatch.time, 'time', this.calcTime);
          this.$set(this.newMatch.time, 'date', this.calcDate); 
          this.$set(this.newMatch.time, 'uts', this.calcTimeStamp); 
        },
          deep: true
      }
    },

    computed : {
      calcTime (){    //process time for string, add zero if needed
        return this.date.getUTCHours() + ':' + (this.date.getMinutes()<10?'0':'') + this.date.getMinutes();
      },

      calcDate (){  //process date for string, add 1 for month and cut 2 chars from year
        return String(this.date.getDate()).padStart(2, '0') + '/' + String(this.date.getMonth() + 1).padStart(2, '0') + '/' + this.date.getFullYear().toString().substr(-2);
      },

      calcTimeStamp() {   // create Time Stamp is seconds (following pattern)
        return Math.round(+this.date/1000);
      }
    },

    methods: {

      checkFormValidity() {  // simple validation
        const valid = this.$refs.form.checkValidity()
        this.validity = valid
        return valid
      },

      includeResult() {  // pleacing result to another place in the Object (it is present at two places)
          this.$set(this.newMatch.periods.ft, 'home', this.newMatch.result.home);
          this.$set(this.newMatch.periods.ft, 'away', this.newMatch.result.away);
      },

      nameState(propData) 
      {
        return propData.length >= 4  // set valid or invalid status (boolean), Team name has to be at leadt 4 characters
      },

      invalidFeedback(propData) { // setting messeges
        if (propData.length > 0) 
        {
          return 'Enter at least 4 characters.'
        }
        return 'Please enter something.'
      },

      nameStateNum(propData) // number validation, has to be positive or zero, 0-10
      {
        return (propData.length > 0 && propData < 11 && propData > -1)
      },

      resetModal() {    // setting up the structure of the original object from API, so that can be actually send for insertion
        this.newMatch = 
            {
              bestof : null,
              canceled : false,
              comment : null,
              disqualified : false,
              inlivescore : true,
              neutralground : false,
              periods : {
                ft : {
                  away : 0,
                  home : 0
                },
                p1 : {
                  away : 0,
                  home : 0
                }
              },
              postponed : false,
              result : { 
                away : 0,
                home : 0,
                period : 'nt',
                winner : ''
              },
              retired : false,
              round : 1,
              roundname : {
                name : 1,
                _doc: "tableround",
                _id: 1
              },
              stadiumid: 0,
              status : null,
              teams : {
                away : {
                  abbr : null,
                  haslogo : false,
                  iscountry: false,
                  mediumname: '',
                  name: '',
                  nickname: null,
                  uid: null,
                  virtual: false,
                  _doc: "team",
                  _id: 14486373,
                  _sid: 1
                },
                home : {
                  abbr : null,
                  haslogo : false,
                  iscountry: false,
                  mediumname: "",
                  name: "",
                  nickname: null,
                  uid: null,
                  virtual: false,
                  _doc: "team",
                  _id: 14486373,
                  _sid: 1
                }           
              },
              time : {
                  date : this.calcDate,
                  time : this.calcTime,
                  tz : 'UTC',
                  tzoffset: 0,
                  uts: this.calcTimeStamp,
                  _doc: "time"
              },
              tobeannounced: false,
              walkover: false,
              week: 10,
              _doc: "match",
              _id: null,   //has to be incremented
              _rcid: 2123,
              _seasonid: 76925,
              _sid: 1,
              _tid: 93581,
              _utid: 32383
          }
      },

      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmit()
      },

      handleSubmit() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return
        }

        this.$set(this.newMatch.teams.home, 'name', this.newMatch.teams.home.mediumname);   // inserting team names to another place in the Object (following pattern)
        this.$set(this.newMatch.teams.away, 'name', this.newMatch.teams.away.mediumname);
        this.$set(this.newMatch, '_id', this.nextID);

        const completed = {
          [this.nextID] :  this.newMatch   // wrapping the object into a property holding the next ID (served by root component), following data pattern
        }

       this.$emit('addition', completed);  // sending back the completed object to root component
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('newmatch-modal')    // close modal
        })
      }
    },
    created() {
        this.resetModal();    // call data structure creation when starting up component
    }
}

</script>

<style scoped>
.resultWidth {   /* number inpit field width */
    width : 6em!important;  
}
</style>