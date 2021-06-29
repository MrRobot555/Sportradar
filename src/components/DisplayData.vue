<template>
  <div>
    <b-row>
      <b-table
        id="table-transition-example"
        striped
        hover
        :items="filtered"
        :responsive="true"
        :fields="fields"
        :tbody-transition-props="transProps"
        primary-key="ID"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
      >
        <template #cell(Match_Teams)="data">
          <span v-html="data.value"></span>
        </template>

        <template #cell(Result)="data">
          <span v-html="data.value"></span>
        </template>

        <template #cell(Actions)="data">
          <b-button
            size="sm"
            variant="danger"
            class="text-nowrap myMinWidth"
            @click="deletion(data.item.ID)"
            ><b-spinner
              v-if="data.item.Actions.inprogress"
              class="mr-2"
              small
              variant="light"
            ></b-spinner
            >Delete</b-button
          >
        </template>

        <template slot="top-row" slot-scope="{ fields }">
          <td v-for="field in fields" :key="field.key">
            <input
              v-if="field.label !== 'Actions'"
              v-model="filters[field.key]"
              :placeholder="field.label"
            />
          </td>
        </template>
      </b-table>
    </b-row>
  </div>
</template>

<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    items: {
      type: Array,
      required: false
    }
  },

  data() {
    return {
      sortBy: "ID",
      sortDesc: true,
      filters: {
        ID: "",
        Match_Teams: "",
        Date: "",
        Time: "",
        Result: ""
      },
      fields: [
        { key: "ID", sortable: true },
        { key: "Match_Teams", sortable: true },
        { key: "Date", sortable: true },
        { key: "Time", sortable: true },
        { key: "Result", sortable: false },
        { key: "Actions", sortable: false }
      ],
      transProps: {
        name: "flip-list"
      }
    };
  },

  computed: {
    filtered() {
      if (this.items) {
        const filtered = this.items.filter(item => {
          return Object.keys(this.filters).every(key =>
            String(item[key]).includes(this.filters[key])
          );
        });
        return filtered.length > 0
          ? filtered
          : [
              {
                ID: "",
                Match_Teams: "",
                Date: "",
                Time: "",
                Result: "",
                Actions: {
                  inprogress: false
                }
              }
            ];
      } else {
        return this.items;
      }
    }
  },

  methods: {
    deletion(id) {
      this.$emit("deletion", id);
    }
  }
};
</script>

<style scoped>
table#table-transition-example .flip-list-move {
  transition: transform 1s;
}
input {
  width: 100%;
}
.myMinWidth {
  min-width: 7em;
}
</style>
