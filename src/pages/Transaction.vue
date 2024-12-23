<template>
  <app-layout page-title="Transaction" page-default-back-link="/microfin">
    <ion-card>
      <ion-card-header>
        <ion-card-title class="ion-text-center">{{
          transaction.category_name
        }}</ion-card-title>
        <ion-list>
          <ion-item v-if="transaction.transaction_type == 'Loans & Advances'">
            <ion-label>Party Name</ion-label>
            <ion-label class="ion-text-right"
              >{{ displayParty(transaction.party_id) }}</ion-label
            >
          </ion-item>
          <ion-item>
            <ion-label>Amount</ion-label>
            <ion-label v-if="!isEditable" class="ion-text-right"
              >Rs {{ transaction.amount }}</ion-label
            >
            <ion-input
            class="ion-text-right"
              v-else
              v-model="editableTransaction.amount"
              type="number"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>Description</ion-label>
            <ion-label v-if="!isEditable" class="ion-text-right">{{
              transaction.description
            }}</ion-label>
            <ion-input
            class="ion-text-right"
              v-else
              v-model="editableTransaction.description"
              type="text"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>Transaction Date</ion-label>
            <ion-label v-if="!isEditable" class="ion-text-right">{{
              useTransactionsStore().formatDateTime(transaction.created_at)
            }}</ion-label>
            <ion-datetime
              v-else
              v-model="formattedCreatedAt"
              
              @ionChange="handleDateChange"
              presentation="date-time"
            ></ion-datetime>
          </ion-item>

          <ion-item>
            <ion-label>Payment By</ion-label>
            <ion-label v-if="!isEditable" class="ion-text-right">{{
              paymentBy(transaction.account_id)
            }}</ion-label>

          <ion-select
            v-else
            v-model="editableTransaction.account_id"
            interface="popover"
            placeholder="Select One"
          >
            <ion-select-option
              v-for="account in accounts"
              :key="account.id"
              :value="account.id"
            >
              {{ account.account_name }}
            </ion-select-option>
          </ion-select>
          </ion-item>

          <ion-item style="--inner-border-width: 0">
            <ion-label 
            v-if="!isEditable"
            @click="isEditable = !isEditable"
            color="warning">
              <ion-tab-button 
                ><ion-icon :icon="icons.createOutline"></ion-icon
                >Edit</ion-tab-button
              >
            </ion-label>
            <ion-label 
            v-else
            @click="updateTransaction"
            color="success">
              <ion-tab-button
                ><ion-icon :icon="icons.checkmarkCircleOutline"></ion-icon
                >Save</ion-tab-button
              >
            </ion-label>
            <ion-label 
            v-if="isEditable"
            @click="isEditable = !isEditable"
            color="danger">
              <ion-tab-button 
                ><ion-icon :icon="icons.closeCircleOutline"></ion-icon
                >Cancel</ion-tab-button
              >
            </ion-label>
            <ion-label
            v-if="!isEditable"
            @click="deleteTransaction"
            color="danger">
              <ion-tab-button
                ><ion-icon :icon="icons.trashBinOutline"></ion-icon
                >Delete</ion-tab-button
              >
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card-header>
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
  IonSelect,
  IonSelectOption,
  IonFabList,
  modalController,
  IonDatetime,
} from "@ionic/vue";
import { useTransactionsStore } from "../stores/transactions";
import { format, parseISO } from 'date-fns';
import { useRoute } from "vue-router";
import * as icons from "ionicons/icons";
import { onMounted, ref, computed, watch } from "vue";
import AppLayout from "../components/base/AppLayout.vue";
import { useToast } from "vue-toastification";
import { formatInTimeZone } from 'date-fns-tz';
import axios from "axios";

const toast = useToast();
const route = useRoute();
const apiURL = import.meta.env.VITE_API_BASE_URL;
const transactionId = parseInt(route.params.id);
const isEditable = ref(false);
console.log(transactionId);

watch(()=>isEditable.value, (newVal)=>{
  console.log(newVal);
})

const displayParty = (partyId) => {
  const party = useTransactionsStore().parties.find(party => party.id === partyId);
  return party.party_name;
}

const transaction = useTransactionsStore().editTransaction(transactionId).value;
const editableTransaction = ref({ ...transaction});

const accounts = useTransactionsStore().accounts;

const paymentBy = (accountId) => {
  const account = accounts.find(acc => acc.id === accountId);
  return account.account_name;
}

const handleDateChange = (event) => {
  const selectedDate = event.detail.value;
  // Convert selected date to UTC
  editableTransaction.value.created_at = selectedDate;
};

const updateTransaction = () => {
    axios.put(`${apiURL}/api/transaction/update`, editableTransaction.value)
    .then(response => {
       isEditable.value = false;
       localStorage.setItem("transactionUpdated", true);
       window.location.href = "/transactions";
      
     })
     .catch(error => {
        toast.error('Failed to update transaction.');
       console.error('Error updating transaction:', error);
     });
}

const formattedCreatedAt = computed(()=>{
  const date = new Date(editableTransaction.value.created_at);
  return date.toISOString().slice(0, 16);
})

const deleteTransaction = () => {
  axios.delete(`${apiURL}/api/transaction/delete/${transactionId}`)
    .then(response => {
       isEditable.value = false;
       localStorage.setItem("transactionDeleted", true);
       window.location.href = "/transactions";
     })
    .catch(error => {
       toast.error('Failed to delete transaction.');
       console.error('Error deleting transaction:', error);
     });
}
</script>

<style scoped></style>