<template>
  <div>
    <b-button v-b-modal.newmatch-modal class="my-2" size="lg" variant="primary"
      >+ match</b-button
    >

    <b-modal
      id="newmatch-modal"
      ref="newmatch-modal"
      title="Add a new match"
      scrollable
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">

        <b-form-group
          label="Name of Home Team"
          label-for="team-home-name"
          :invalid-feedback="invalidFeedback(newMatch.teams.home.mediumname)"
          valid-feedback="Tank you!"
        >
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
        >
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
        >
          <v-date-picker
            id="match-date-time"
            v-model="date"
            is-expanded
            mode="dateTime"
            :is24hr="format24h"
            :timezone="timezone"
          />
        </b-form-group>

        <b-form-group
          label="Please set result for first half of the Match (HOME : AWAY)"
          :valid-feedback="valNumFeed"
          :invalid-feedback="invNumFeed"
          class="form-inline"
        >
          <b-form-input
            id="result-first-half-home"
            v-model="newMatch.periods.p1.home"
            type="number"
            required
            min="0"
            class="resultWidth"
            :state="nameStateNum(newMatch.periods.p1.home)"
          >
          </b-form-input>
          <span> : </span>
          <b-form-input
            id="result-first-half-away"
            v-model="newMatch.periods.p1.away"
            type="number"
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
        >
          <b-form-input
            id="result-final-home"
            v-model="newMatch.result.home"
            type="number"
            required
            min="0"
            class="resultWidth"
            :state="nameStateNum(newMatch.result.home)"
            @input="includeResult"
          >
          </b-form-input>
          <span> : </span>
          <b-form-input
            id="result-final-away"
            v-model="newMatch.result.away"
            type="number"
            required
            min="0"
            class="resultWidth"
            :state="nameStateNum(newMatch.result.away)"
            @input="includeResult"
          >
          </b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    nextID: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      newMatch: {},
      date: new Date(),
      timezone: "utc",
      format24h: true,
      validity: null,
      invNumFeed: "Enter numbers between 0-10 only!",
      valNumFeed: "Tank you!"
    };
  },

  computed: {
    calcTime() {
      return (
        this.date.getUTCHours() +
        ":" +
        (this.date.getMinutes() < 10 ? "0" : "") +
        this.date.getMinutes()
      );
    },

    calcDate() {
      return (
        String(this.date.getDate()).padStart(2, "0") +
        "/" +
        String(this.date.getMonth() + 1).padStart(2, "0") +
        "/" +
        this.date
          .getFullYear()
          .toString()
          .substr(-2)
      );
    },

    calcTimeStamp() {
      return Math.round(+this.date / 1000);
    }
  },

  watch: {
    date: {
      handler: function() {
        this.$set(this.newMatch.time, "time", this.calcTime);
        this.$set(this.newMatch.time, "date", this.calcDate);
        this.$set(this.newMatch.time, "uts", this.calcTimeStamp);
      },
      deep: true
    }
  },
  created() {
    this.resetModal();
  },

  methods: {
    checkFormValidity() {
      // simple validation
      const valid = this.$refs.form.checkValidity();
      this.validity = valid;
      return valid;
    },

    includeResult() {
      this.$set(this.newMatch.periods.ft, "home", this.newMatch.result.home);
      this.$set(this.newMatch.periods.ft, "away", this.newMatch.result.away);
    },

    nameState(propData) {
      return propData.length >= 4;
    },

    invalidFeedback(propData) {
      if (propData.length > 0) {
        return "Enter at least 4 characters.";
      }
      return "Please enter something.";
    },

    nameStateNum(propData) {
      return propData.length > 0 && propData < 11 && propData > -1;
    },

    resetModal() {
      this.newMatch = {
        bestof: null,
        canceled: false,
        comment: null,
        disqualified: false,
        inlivescore: true,
        neutralground: false,
        periods: {
          ft: {
            away: 0,
            home: 0
          },
          p1: {
            away: 0,
            home: 0
          }
        },
        postponed: false,
        result: {
          away: 0,
          home: 0,
          period: "nt",
          winner: ""
        },
        retired: false,
        round: 1,
        roundname: {
          name: 1,
          _doc: "tableround",
          _id: 1
        },
        stadiumid: 0,
        status: null,
        teams: {
          away: {
            abbr: null,
            haslogo: false,
            iscountry: false,
            mediumname: "",
            name: "",
            nickname: null,
            uid: null,
            virtual: false,
            _doc: "team",
            _id: 14486373,
            _sid: 1
          },
          home: {
            abbr: null,
            haslogo: false,
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
        time: {
          date: this.calcDate,
          time: this.calcTime,
          tz: "UTC",
          tzoffset: 0,
          uts: this.calcTimeStamp,
          _doc: "time"
        },
        tobeannounced: false,
        walkover: false,
        week: 10,
        _doc: "match",
        _id: null,
        _rcid: 2123,
        _seasonid: 76925,
        _sid: 1,
        _tid: 93581,
        _utid: 32383
      };
    },

    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },

    handleSubmit() {
      if (!this.checkFormValidity()) {
        return;
      }

      this.$set(
        this.newMatch.teams.home,
        "name",
        this.newMatch.teams.home.mediumname
      );
      this.$set(
        this.newMatch.teams.away,
        "name",
        this.newMatch.teams.away.mediumname
      );
      this.$set(this.newMatch, "_id", this.nextID);

      const completed = {
        [this.nextID]: this.newMatch
      };

      this.$emit("addition", completed);

      this.$nextTick(() => {
        this.$bvModal.hide("newmatch-modal");
      });
    }
  }
};
</script>

<style scoped>
.resultWidth {
  width: 6em !important;
}
</style>
