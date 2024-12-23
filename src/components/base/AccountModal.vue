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
            Add an Account
          </ion-card-title>
          <ion-card-subtitle
            class="ion-text-center ion-margin-bottom text-indigo-darken-1"
          >
            Use this form to create an Account.
          </ion-card-subtitle>
        </ion-card-header>
        <form @submit.prevent="createAccount">
          <ion-item>
            <ion-label>Account Type</ion-label>
            <ion-select
              v-model="form.account_type"
              interface="popover"
              placeholder="Select One"
            >
              <ion-select-option
                v-for="account in populate.account_type"
                :key="account"
                :value="account"
              >
                {{ account }}
              </ion-select-option>
            </ion-select>
          </ion-item> 

          <ion-item>
            <ion-label position="floating">Account Name</ion-label>
            <ion-input type="text" v-model="form.account_name"></ion-input>
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

  const toast = useToast();  
  const name = ref();
  const apiURL = import.meta.env.VITE_API_BASE_URL;

  
  const modalTitle = ref("Create Account");

  const populate = reactive({
    account_type: ["Saving Account", "Current Account"],
  });
  
  const form = reactive({
    account_name: null,
    account_type: null,
  })

  const createAccount = () => {
    axios.post(`${apiURL}/api/account/create`, form)
    .then(() => {
        localStorage.setItem('accountCreated', true);
        window.location.href = '/accounts';
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
  