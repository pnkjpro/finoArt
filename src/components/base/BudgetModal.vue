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
            Add a Budget
          </ion-card-title>
          <ion-card-subtitle
            class="ion-text-center ion-margin-bottom text-indigo-darken-1"
          >
            Use this form to create a Budget.
          </ion-card-subtitle>
        </ion-card-header>
        <form @submit.prevent="updateBudget">
          <ion-item>
            <ion-label>Select Expense</ion-label>
            <ion-select
              v-model="form.exp_category"
              interface="popover"
              placeholder="Select One"
            >
              <ion-select-option
                v-for="category in exp_categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.category_name }}
              </ion-select-option>
            </ion-select>
          </ion-item> 

          <ion-item>
            <ion-label position="floating">Amount</ion-label>
            <ion-input type="number" v-model="form.amount"></ion-input>
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
  const apiURL = import.meta.env.VITE_API_BASE_URL;
  let drawer = ref(false);
  let showTransactionModal = ref(false);
  let transactions = ref({});
  const transactionsStore = useTransactionsStore();
  const { exp_categories } =
    transactionsStore;
  
  const modalTitle = ref("Create Budget");
  
  const form = reactive({
    exp_category: null,
    amount: null,
  })

  const updateBudget = () => {
    axios.post(`${apiURL}/api/budget/update`, form)
    .then(() => {
        localStorage.setItem('budgetCreated', true);
        window.location.href = '/budgets';
      })
     .catch(error => {
        toast.error("Error Creating Account");
        console.error(error);
      });
  }

  watch(()=> form, (newVal)=>{
    console.log(newVal);
  }, { deep: true})
  
  </script>
  