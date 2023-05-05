<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="ma-12">
        <v-row>
            <v-col>
                <h1 class="mb-6">
                    Instruktur
                    <span class="blue--text">GO</span><span class="red--text">FID</span>
                </h1>
            </v-col>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
            <v-col align="right">
                <v-btn class="ma-2" color="primary" to="Instruktur/Create"><v-icon>mdi-plus</v-icon></v-btn>
            </v-col>
        </v-row>
        <template>
            <v-data-table :headers="headers" :items="InstukturController" :search="search">

                <template v-slot:item.FOTO_USER="{ item }">
                    <v-avatar>
                        <img :src="'data:image/jpeg;base64,' + item.FOTO_USER">
                    </v-avatar>
                </template>
                <template v-slot:item.IS_DELETED_PEGAWAI="{ item }">
                    {{ item.IS_DELETED_PEGAWAI == 1 ? 'Tidak Aktif' : ' Aktif' }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <!-- <router-link :to="{ path: `/Admin/Instruktur/Update/${item.ID_INSTRUKTUR}`, name: 'InstrukturUpdate' }"> -->
                    <v-btn small class="mr-2" @click="openUpdateDialog(item)">
                        <v-icon dark>mdi-pencil</v-icon>
                    </v-btn>
                    <!-- </router-link> -->

                    <v-btn small @click="openDeleteDialog(item)">
                        <v-icon dark>mdi-delete</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </template>

        <!-- deleteDialog -->
        <v-dialog v-model="deleteDialog" max-width="320" persistent>
            <v-card>
                <v-card-title class="text-h5">
                    Are you sure you want to delete this user?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="closeDeleteDialog()">
                        Cancel
                    </v-btn>
                    <v-btn color="green darken-1" text @click="deleteProcess()">
                        Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- PerifDialog -->
        <v-dialog v-model="VerifDialog" max-width="320" persistent>
            <v-card>
                <v-card-title class="text-h5">
                    Are you sure you want to Update this user?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="closeVerifDialog()">
                        Cancel
                    </v-btn>
                    <v-btn color="green darken-1" text @click="UpdateInstrukturProccess()">
                        Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <template>
            <v-form>
                <v-row justify="center">
                    <v-dialog v-model="UpdateDialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
                        <v-card>
                            <v-toolbar dark color="primary">
                                <v-btn icon dark @click="UpdateDialog = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                                <v-toolbar-title>Update Instruktur {{ editData.NAMA_USER }}</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-toolbar-items>
                                    <v-btn variant="text" color="primary" @click="openVerifDialog(item)">
                                        Save
                                    </v-btn>
                                </v-toolbar-items>
                            </v-toolbar>
                            <br>
                            <br>
                            <br>
                            <br>
                            <v-row>
                                <v-col cols="12" sm="4" md="4" left>
                                    <v-file-input v-model="editData.FOTO_USER" style="display: none" id="imageInput"
                                        accept="image/*" @change="setPreviewImage">
                                    </v-file-input>
                                    <div class="text-center">
                                        <img src="../../../assets/account-circle.svg" @click="document.querySelector('#imageInput').click()
                                            " id="imagePreview" style="
                                            border-radius: 50%;
                                            cursor: pointer;
                                            max-width: 256px;
                                            max-height: 256px;
                                            min-width: 256px;
                                            min-height: 256px;
                                            object-fit: cover;
                                            " />
                                    </div>
                                </v-col>
                                <v-col cols="12" md="5">
                                    <v-text-field v-model="editData.ID_USER" label="ID User" prepend-icon="mdi-key"
                                        disabled>
                                    </v-text-field>
                                    <v-text-field v-model="editData.NAMA_USER" label="Name" prepend-icon="mdi-account"
                                        >
                                    </v-text-field>
                                    <v-text-field v-model="editData.EMAIL_USER" label="Email" prepend-icon="mdi-email"
                                        >
                                    </v-text-field>
                                    <v-menu v-model="birthdatePicker" :close-on-content-click="false" :nudge-right="40"
                                         transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="editData.TANGGAL_LAHIR_USER" label="Birthdate" 
                                                prepend-icon="mdi-calendar" readonly v-bind="attrs"
                                                v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="editData.TANGGAL_LAHIR_USER" 
                                            @input="birthdatePicker = false"></v-date-picker>
                                    </v-menu>
                                    <v-text-field v-model="editData.DESKRIPSI_INSTRUKTUR" label="Motto"
                                        prepend-icon="mdi-book">
                                        <!-- :rules="[val => /^\d+$/.test(val) || 'Nomor Telp Harus Angka']" -->
                                    </v-text-field>

                                </v-col>
                            </v-row>
                        </v-card>
                    </v-dialog>
                </v-row>
            </v-form>
        </template>
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
            search: '',
            window,
            deleteDialog: false,
            VerifDialog: false,
            birthdatePicker: false,
            UpdateDialog: false,
            editData: {
                ID_INSTRUKTUR: null,
                NAMA_USER: null,
                FOTO_USER: null,
                EMAIL_USER: null,
                DESKRIPSI_INSTRUKTUR: null,
                TANGGAL_LAHIR_USER: null,
            },
            headers: [
                { text: "ID_INSTRUKTUR", value: "ID_INSTRUKTUR" },
                { text: "Nama", value: "NAMA_USER" },
                { text: "Foto", value: "FOTO_USER" },
                { text: "Email", value: "EMAIL_USER" },
                { text: "About", value: "DESKRIPSI_INSTRUKTUR" },
                { text: "STATUS", value: "IS_DELETED_PEGAWAI" },
                { text: "Actions", value: "actions", sortable: false },
            ],
        };
    },

    methods: {
        UpdateInstrukturProccess() {
            if (this.editData.DESKRIPSI_INSTRUKTUR == "") {
                toastr.error('Please fill in the Motto!')
                return;
            }
            if (this.editData.NAMA_USER == "") {
                toastr.error('Please fill in the name!')
                return;
            }
            if (this.editData.EMAIL_USER == "") {
                toastr.error('Please fill in the Email!')
                return;
            }
            if (this.editData.TANGGAL_LAHIR_USER == "") {
                toastr.error('Please fill in the Bhirtday!')
                return;
            }

            axios.put('http://localhost:8000/api/instruktur/update/' + this.editData.ID_USER, {
                DESKRIPSI_INSTRUKTUR: this.editData.DESKRIPSI_INSTRUKTUR,
                NAMA_USER: this.editData.NAMA_USER,
                EMAIL_USER: this.editData.EMAIL_USER,
                TANGGAL_LAHIR_USER: this.editData.TANGGAL_LAHIR_USER

            },
            )
                .then(() => {
                    toastr.success('You have successfully Update, Thanks You')
                    this.UpdateDialog = false;
                    window.location.reload();
                    console.log(this.formUser)
                }
                ).catch(error => {
                    toastr.error('Registration failed!')
                    console.log(error);

                }
                )

        },
        setPreviewImage() {
            const [file] = document.querySelector("#imageInput").files;
            if (file) {
                document.querySelector("#imagePreview").src =
                    URL.createObjectURL(file);
            }
        },
        openDeleteDialog(item) {
            this.deleteDialog = true;
            this.deleteTarget = item;
        },
        closeDeleteDialog() {
            this.deleteDialog = false;
            this.deleteTarget = {};
        },
        openVerifDialog(item) {
            this.VerifDialog = true;
            this.deleteTarget = item;
        },
        closeVerifDialog() {
            this.VerifDialog = false;
            this.UpdateDialog = false;
            this.deleteTarget = {};
        },
        openUpdateDialog(item) {
            this.UpdateDialog = true;
            this.editData.ID_USER = item.ID_USER
            this.editData.NAMA_USER = item.NAMA_USER
            this.editData.FOTO_USER = item.FOTO_USER
            this.editData.EMAIL_USER = item.EMAIL_USER
            this.editData.DESKRIPSI_INSTRUKTUR = item.DESKRIPSI_INSTRUKTUR
            this.editData.TANGGAL_LAHIR_USER = item.TANGGAL_LAHIR_USER
            this.updateTarget = item;
        },
        deleteProcess() {
            axios.delete('http://localhost:8000/api/instruktur/destroy/' + this.deleteTarget.ID_USER)
                .then(response => {
                    this.users = response.data.data;
                    toastr.success('User deleted successfully');
                    window.location.reload();
                })
                .catch(error => {
                    console.log(error);
                    toastr.error('User deletion failed');
                });
            this.closeDeleteDialog();
        },

    },

    setup() {
        let InstukturController = ref([]);
        onMounted(() => {
            axios.get('http://localhost:8000/api/instruktur')
                .then(response => {
                    InstukturController.value = response.data.data
                    console.log(InstukturController.value[0].ID_INSTRUKTUR)
                }).catch(error => {
                    console.log(error.response.data)
                })
        })
        return {
            InstukturController
        }

    }
}
</script>