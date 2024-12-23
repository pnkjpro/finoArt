<template>
  <app-layout page-title="Update Budget" page-default-back-link="/microfin">
    <ion-card>
      <ion-card-header color="light">
        <ion-card-subtitle>Edit Budget</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          <ion-item class="ion-padding-top">
            <ion-label color="primary"
              ><h2>{{ budget.category_name }}</h2></ion-label
            >

            <ion-input
            class="ion-text-right"
              v-model="form.amount"
              type="number"
              placeholder="Amount"
            ></ion-input>
          </ion-item>
          <ion-progress-bar type="linear" :value="useBudgetStore().progressValue(budget.category_name, budget.budget_amount)"
                :style="{'--ion-color-primary': useBudgetStore().progressColor(budget.category_name, budget.budget_amount)}"
                ></ion-progress-bar>
          <ion-item>
            <ion-label @click="updateBudget" color="success">
              <ion-tab-button
                ><ion-icon :icon="icons.checkmarkCircleOutline"></ion-icon
                >Save</ion-tab-button
              >
            </ion-label>
            <ion-label @click="deleteBudget" class="ion-text-right">
              <ion-tab-button>
                <ion-icon
                  :icon="icons.trashBinOutline"
                  color="danger"
                ></ion-icon
                >Delete
              </ion-tab-button>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>
  </app-layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import {
  IonList,
  IonItem,
  IonLabel,
  IonImg,
  IonThumbnail,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonTabButton,
  IonCardSubtitle,
  IonCardContent,
  IonProgressBar,
  IonInput,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonFabList,
  modalController,
  IonDatetime,
} from "@ionic/vue";
import { useRoute } from "vue-router";
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useTransactionsStore } from "../stores/transactions";
import { useBudgetStore } from "../stores/budgets";
import AppLayout from "../components/base/AppLayout.vue";
import { useToast } from "vue-toastification";

import * as icons from "ionicons/icons";
import axios from "axios";

const toast = useToast();
const route = useRoute();
const budgetId = parseInt(route.params.id);
const isEditable = ref(false);
const apiURL = import.meta.env.VITE_API_BASE_URL;

const transactionsStore = useTransactionsStore();
const { exp_categories, transactions } = storeToRefs(transactionsStore);

const budget = computed(() =>
  exp_categories.value.find((exp) => exp.id === budgetId)
);

const Amount = ref(budget.value.budget_amount);

const deleteBudget = () => {
  console.log("deleteBudget");
  if (confirm("Are you sure you want to delete this budget?")) {
    axios
      .delete(`${apiURL}/api/budget/delete/${budgetId}`)
      .then(() => {
        localStorage.setItem("budgetDeleted", true);
        window.location.href = "/budgets";
      })
      .catch((error) => {
        toast.error("Error Deleting Budget", { timeout: 5000 });
        console.error(error);
      });
  } else {
        toast.error("User Cancelled to delete this Budget", { timeout: 5000 });
        return;
  }
};

const form = reactive({
  exp_category: budgetId,
  amount: Amount,
});

const updateBudget = () => {
  axios
    .post(`${apiURL}/api/budget/update`, form)
    .then(() => {
      localStorage.setItem('budgetUpdated', true);
      window.location.href = "/budgets";
    })
    .catch((error) => {
      toast.error("Error Creating Account");
      console.error(error);
    });
};
</script>

<style scoped></style>
