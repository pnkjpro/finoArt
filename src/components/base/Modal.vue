<template>
  <ion-header>
    <ion-toolbar>
      <ion-title class="ion-text-center">{{ modalTitle }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-card class="ion-padding">
      <ion-card-header>
        <ion-card-title class="ion-text-center text-pink-darken-3">
          Add a Transaction
        </ion-card-title>
        <ion-card-subtitle
          class="ion-text-center ion-margin-bottom text-indigo-darken-1"
        >
          Use this form to create a transaction.
        </ion-card-subtitle>
      </ion-card-header>
      <form @submit.prevent="createOrUpdateTransaction">
        <ion-item>
          <ion-label>Select Transaction Type</ion-label>
          <ion-select
            v-model="form.transaction_type"
            interface="popover"
            placeholder="Select One"
          >
            <ion-select-option
              v-for="type in populate.transaction_type"
              :key="type"
              :value="type"
            >
              {{ type }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item v-if="form.transaction_type === 'Expense'">
          <ion-label>Select Expense Categories</ion-label>
          <ion-select
            v-model="form.exp_category"
            interface="popover"
            placeholder="Select One"
          >
            <ion-select-option
              v-for="category in populate.exp_categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.category_name }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item v-if="form.transaction_type === 'Income'">
          <ion-label>Select Income Type</ion-label>
          <ion-select
            v-model="form.income_category"
            interface="popover"
            placeholder="Select One"
          >
            <ion-select-option
              v-for="category in populate.income_categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.category_name }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item v-if="form.transaction_type === 'Loans & Advances'">
          <ion-label>Select Loans & Advances</ion-label>
          <ion-select
            v-model="form.loan_type"
            interface="popover"
            placeholder="Select One"
          >
            <ion-select-option
              v-for="loan in populate.loan_type"
              :key="loan.id"
              :value="loan.id"
            >
              {{ loan.category_name }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item
          v-if="form.transaction_type === 'Loans & Advances' && form.loan_type"
        >
          <ion-label>Select Party</ion-label>
          <ion-select
            v-model="form.party_id"
            interface="popover"
            placeholder="Select One"
          >
            <ion-select-option
              v-for="party in populate.parties"
              :key="party.id"
              :value="party.id"
            >
              {{ party.party_name }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item
          v-if="
            form.transaction_type === 'Loans & Advances' &&
            form.party_id === populate.parties[populate.parties.length-1].id
          "
        >
          <ion-label position="floating">Add New Party</ion-label>
          <ion-input
            v-model="form.new_party_name"
            placeholder="Enter New Party Name"
          ></ion-input>
        </ion-item>
        <ion-item
          v-if="
            form.transaction_type === 'Loans & Advances' &&
            form.party_id === populate.parties[populate.parties.length-1].id
          "
        >
          <ion-label position="floating">Add Party Mobile No.</ion-label>
          <ion-input
            v-model="form.new_party_mobile"
            placeholder="Enter Party Mobile No."
          ></ion-input>
        </ion-item>
        <ion-item
          v-if="
            form.transaction_type === 'Loans & Advances' &&
            form.party_id === populate.parties[populate.parties.length-1].id
          "
        >
          <ion-label position="floating">Add Party Email Id</ion-label>
          <ion-input
            v-model="form.new_party_email"
            placeholder="Enter Party Email (optional)"
          ></ion-input>
        </ion-item>

        <ion-item v-if="form.transaction_type === 'Deposit'">
          <ion-label>Select Account</ion-label>
          <ion-select
            v-model="form.deposit_to"
            interface="popover"
            placeholder="Select One"
          >
            <ion-select-option
              v-for="account in populate.accounts.filter(a => a.account_name.toLowerCase() !== 'cash')"
              :key="account.id"
              :value="account.id"
            >
              {{ account.account_name }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item v-if="form.transaction_type === 'Withdraw'">
          <ion-label>Select Account</ion-label>
          <ion-select
            v-model="form.withdraw_from"
            interface="popover"
            placeholder="Select One"
          >
            <ion-select-option
              v-for="account in populate.accounts.filter(a => a.account_name.toLowerCase() !== 'cash')"
              :key="account.id"
              :value="account.id"
            >
              {{ account.account_name }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item v-if="form.transaction_type === 'Transfer'">
          <ion-label>Transfer From</ion-label>
          <ion-select
            v-model="form.transfer_from"
            interface="popover"
            placeholder="Select One"
          >
            <ion-select-option
              v-for="account in populate.accounts.filter(a => a.account_name.toLowerCase() !== 'cash')"
              :key="account.id"
              :value="account.id"
            >
              {{ account.account_name }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item v-if="form.transaction_type === 'Transfer'">
          <ion-label>Transfer To</ion-label>
          <ion-select
            v-model="form.transfer_to"
            interface="popover"
            placeholder="Select One"
          >
            <ion-select-option
              v-for="account in populate.accounts.filter(a => a.account_name.toLowerCase() !== 'cash' && a.id !== form.transfer_from)"
              :key="account.id"
              :value="account.id"
            >
              {{ account.account_name }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Amount</ion-label>
          <ion-input type="number" v-model="form.amount"></ion-input>
        </ion-item>
        <ion-label v-if="form.transaction_type === 'Cash in Hand'" style="margin-left: 12px;">Refill your Cash in Hand</ion-label>

        <ion-item>
          <ion-label position="floating">Description</ion-label>
          <ion-textarea v-model="form.description"></ion-textarea>
        </ion-item>
        

        <ion-item
          v-if="
            form.transaction_type !== 'Withdraw' &&
            form.transaction_type !== 'Transfer' &&
            form.transaction_type !== 'Cash in Hand' &&
            form.transaction_type !== 'Deposit'
          "
        >
          <ion-label>Select Account</ion-label>
          <ion-select
            v-model="form.account"
            interface="popover"
            placeholder="Select One"
          >
            <ion-select-option
              v-for="account in populate.accounts"
              :key="account.id"
              :value="account.id"
            >
              {{ account.account_name }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item @click="form.showDateTimePicker = true">
          <ion-datetime
            v-if="form.showDateTimePicker"
            v-model="form.selectedDate"
            @ionCancel="form.showDateTimePicker = false"
            @ionChange="form.showDateTimePicker = false"
          ></ion-datetime>
          <ion-label v-if="!form.showDateTimePicker">
            {{ form.selectedDate ? form.selectedDate : 'Select Date' }}
          </ion-label>
        </ion-item>
        <ion-grid>
          <ion-row>
            <ion-col size="6">
              <ion-button expand="full" type="submit" color="primary"
                >Submit</ion-button
              >
            </ion-col>
            <ion-col size="6">
              <ion-button expand="full" color="danger" @click="cancel"
                >Close</ion-button
              >
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    </ion-card>
  </ion-content>
</template>

<script setup>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItem,
  IonInput,
  modalController,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonCol,
  IonRow,
  IonCard,
  IonTextarea,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonDatetime
} from "@ionic/vue";

const cancel = () => modalController.dismiss(null, "cancel");
const confirm = () => modalController.dismiss(name.value, "confirm");

import { ref, reactive, onMounted, watch } from "vue";
import axios from "axios";
import { useTransactionsStore } from "../../stores/transactions";
import { useToast } from "vue-toastification";

const name = ref();
const toast = useToast();
let drawer = ref(false);
const apiURL = import.meta.env.VITE_API_BASE_URL;
let showTransactionModal = ref(false);
let transactions = ref({});
const transactionsStore = useTransactionsStore();
const { exp_categories, income_categories, parties, loan_type, accounts } =
  transactionsStore;

const modalTitle = ref("Create Transaction");

const populate = reactive({
  transaction_type: [
    "Expense",
    "Income",
    "Loans & Advances",
    "Withdraw",
    "Transfer",
    "Deposit",
    "Cash in Hand"
  ],

  exp_categories: exp_categories,
  income_categories: income_categories,
  loan_type: loan_type,
  parties: parties,
  accounts: accounts,
  amount: null,
  description: "",
});

const formInitialState = {
  transaction_type: "",
  exp_category: "",
  income_category: "",
  loan_type: "",
  amount: null,
  description: "",
  account: "",
  transfer_to: "",
  transfer_from: "",
  withdraw_from: "",
  deposit_to: "",
  party_id: "",
  new_party_name: "",
  new_party_mobile: "",
  new_party_email: "",
  showDateTimePicker: false,
  selectedDate: "",
}

const form = reactive({ ...formInitialState });

const createOrUpdateTransaction = () => {
  axios.post(`${apiURL}/api/transaction/create`, form)
  .then(response => {
    localStorage.setItem('transactionCreated', true);
    window.location.reload();
  })
  .catch(error => {
    toast.error("Error creating Transaction");
    console.error(error);
  });
}

watch(() => form.transaction_type, (newVal)=> {
  Object.assign(form, formInitialState);
  form.transaction_type = newVal;
})

watch(() => form, (newVal)=> {
  console.log(newVal);
}, { deep: true})
</script>
