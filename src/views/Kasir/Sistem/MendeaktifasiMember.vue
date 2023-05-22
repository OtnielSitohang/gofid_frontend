<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="ma-12">
        <v-row>
            <v-col>
                <h1 class="mb-6">
                    Member
                    <span class="blue--text">GO</span><span class="red--text">FID</span>
                </h1>
            </v-col>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        </v-row>
        <template>
            <v-data-table :headers="headers" :items="indexMendeaktifasiMember" :search="search">

                <template v-slot:item.actions="{ item }">
                    <v-btn x-small class="mr-2" @click="openVerifDialog(item)"> DEAKTIVASI
                        <v-icon>mdi-rotate-left</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </template>

        <!-- PerifDialog -->
        <v-dialog v-model="VerifDialog" max-width="500" persistent>
            <v-card>
                <v-card-title class="text-h5">
                    Are you sure you want DEAKTIVASI?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="closeVerifDialog()">
                        Cancel
                    </v-btn>
                    <v-btn color="green darken-1" text @click="DekativasiMemberProcess()">
                        Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import router from "@/router";
import { ref, onMounted } from 'vue';
import axios from 'axios'
// import { response } from "express";
import toastr from 'toastr';

export default {
    name: "InstrukturReadComponent",
    data() {
        return {
            router,
            window,
            
            VerifDialog: false,
            ResetDialog: false,
            search: '',
            headers: [
                { text: "ID MEMBERSHIP", value: "ID_MEMBERSHIP" },
                { text: "ID MEMBER", value: "ID_MEMBER" },
                { text: "TANGGAL AKTIVASI", value: "TANGGAL_AKTIVASI_MEMBERSHIP"},
                { text: "TANGGAL KADALUARSA MEMBERSHIP", value: "TANGGAL_KADALUARSA_MEMBERSHIP"},
                { text: "Actions", value: "actions", sortable: false },
            ],
            editData: {
                ID_USER: null,
                NAMA_USER: null,
                FOTO_USER: null,
                EMAIL_USER: null,
                TANGGAL_LAHIR_USER: null,
                ALAMAT_MEMBER: null,
                TELEPON_MEMBER: null,
                SISA_DEPOSIT_MEMBER: 0,
            },
        };
    },

    methods: {
        openVerifDialog(item) {
            this.VerifDialog = true;
            this.DeaktivasiTarget = item;
        },
        closeVerifDialog() {
            this.VerifDialog = false;
            this.UpdateDialog = false;
            this.DeaktivasiTarget = {};
        },
 
        
        DekativasiMemberProcess() {
            axios.put('http://localhost:8000/api/MendeaktifasiMember/' + this.DeaktivasiTarget.MEM_ID_USER)
            .then(response => {
                    // console.log(this.DeaktivasiTarget.MEM_ID_USER)
                    this.users = response.data.data;
                    toastr.success('User Deaktivasi Succes');
                    // window.location.reload();
                })
                .catch(error => {
                    console.log(error);
                    toastr.error('User Deaktivasi failed');
                });
            this.VerifDialog = false;
        },
    },

    setup() {
        let indexMendeaktifasiMember = ref([]);
        onMounted(() => {
            axios.get('http://localhost:8000/api/indexMendeaktifasiMember')
                .then(response => {
                    indexMendeaktifasiMember.value = response.data.data
                    // console.log(indexMendeaktifasiMember.value[0].ID_MEMBER)
                }).catch(error => {
                    console.log(error.response.data)
                })
        })

        return {
            indexMendeaktifasiMember
        }
    }
}
</script>