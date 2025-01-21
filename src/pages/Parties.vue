<template>
  <app-layout page-title="Party Management" page-default-back-link="/microfin">
    <ion-card>
      <ion-card-header color="light">
        <ion-card-subtitle>Party Management</ion-card-subtitle>
      </ion-card-header>

      <ion-card-content>
        <ion-row
          v-for="party in parties.slice(0, parties.length - 1)"
          :key="party.id"
          :router-link="'/party/' + party.id"
        >
          <ion-col class="ion-padding-top">
            <ion-label color="primary"
              ><h2>{{ party.party_name }}</h2></ion-label
            >
            <ion-label
              :color="party.net_amount > 0 ? 'success' : 'danger'"
              class="ion-float-right"
            >
              Rs. {{ party.net_amount }}</ion-label
            >
          </ion-col>
        </ion-row>
        <!-- <ion-row style="justify-content: center; margin-top: 12px;">
                    <ion-button @click="createParty">+ Create Party</ion-button>
                </ion-row> -->
      </ion-card-content>
    </ion-card>
  </app-layout>
</template>

<script setup>
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

import { useTransactionsStore } from "../stores/transactions";
import { ref, onMounted, computed } from "vue";
import AppLayout from "../components/base/AppLayout.vue";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

const transactionsStore = ref([]);
transactionsStore.value = useTransactionsStore();

const { parties, transactions } = storeToRefs(transactionsStore.value);

const total = (partyId) => {
  const partyTransactions = computed(() =>
    transactions.value.filter((t) => t.party_id === partyId)
  );
  return partyTransactions.value.reduce(
    (acc, t) => {
      if (t.category_name === "Taken") {
        acc.taken += t.amount;
      } else if (t.category_name === "Given") {
        acc.given += t.amount;
      }
      return acc;
    },
    { taken: 0, given: 0 }
  );
};

onMounted(() => {
  useTransactionsStore().fetchAPIs();
  if (localStorage.getItem("partyDeleted")) {
    toast.success("Party deleted successfully");
    localStorage.removeItem("partyDeleted");
  }
});
</script>

<style scoped></style>
