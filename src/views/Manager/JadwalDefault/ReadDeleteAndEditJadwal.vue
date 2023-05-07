<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="ma-12">
        <v-row>
            <v-col>
                <h1 class="mb-6">
                    USER
                    <span class="blue--text">GO</span><span class="red--text">FID</span>
                </h1>
            </v-col>
            <v-col align="right">
                <v-btn class="ma-2" color="primary" to="JadwalDefault/Create"><v-icon>mdi-plus</v-icon></v-btn>
            </v-col>
        </v-row>
        <template>
            <v-data-table :headers="headers" :items="jadwalDefaultController">
                <template v-slot:item.HARI_JADWAL_DEFAULT="{ item }">
                    {{ item.HARI_JADWAL_DEFAULT == 0 ? 'Senin' : (item.HARI_JADWAL_DEFAULT == 1 ? 'Selasa' :
                        (item.HARI_JADWAL_DEFAULT == 2 ? 'Rabu' : (item.HARI_JADWAL_DEFAULT == 3 ? 'Kamis' :
                            (item.HARI_JADWAL_DEFAULT == 4 ? 'Jumat' : (item.HARI_JADWAL_DEFAULT == 5 ? 'Sabtu' : 'Minggu'))))) }}
        </template>

        <template v-slot:item.SESI_JADWAL="{ item }">
            {{ item.SESI_JADWAL == 0 ? '06:00 - 08:00' : (item.SESI_JADWAL == 1 ? '08:00 - 10:00' :
                (item.SESI_JADWAL == 2 ? '10:00 - 12:00' : (item.SESI_JADWAL == 3 ? '12:00 - 14:00' : (item.SESI_JADWAL
                    == 4 ? '14:00 - 16:00' : (item.SESI_JADWAL == 5 ? '18:00 - 20:00' : '20:00 - 22:00'))))) }}
        </template>

        <template v-slot:item.actions="{ item }">
            <v-btn x-small class="mr-2" @click="openUpdateDialog(item)">
                <v-icon dark>mdi-pencil</v-icon>
            </v-btn>
            <v-btn x-small @click="openDeleteDialog(item)">
                <v-icon dark>mdi-delete</v-icon>
            </v-btn>
        </template>

        </v-data-table>
        </template>

        <!-- Dialog Delete -->
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


        <!-- Dialog Update -->
        <template>
            <v-form>
                <v-row justify="center">
                    <v-dialog v-model="UpdateDialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
                        <v-card>
                            <v-toolbar dark color="primary">
                                <v-btn icon dark @click="UpdateDialog = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                                <v-toolbar-title>Update Jadwal</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-toolbar-items>
                                    <v-btn variant="text" color="primary" @click="UpdateMemberProcess()">
                                        Save
                                    </v-btn>
                                </v-toolbar-items>
                            </v-toolbar>
                            <br>
                            <br>
                            <br>
                            <br>
                            <v-row>
                                <v-col class="text-center">
                                    <v-select label="Kelas" :items="NamaKelas" item-text="NAMA_KELAS" item-value="ID_KELAS"
                                        v-model="editData.ID_KELAS">
                                    </v-select>

                                    <v-select label="SESI JADWAL" v-model="editData.SESI_JADWAL" :items="SESI_JADWAL" >
                                    </v-select>

                                    <v-select label="HARI" v-model="editData.HARI_JADWAL_DEFAULT"
                                        :items="HARI_JADWAL_DEFAULT">
                                    </v-select>

                                    <v-text-field v-model="editData.HARI_JADWAL_DEFAULT" label="Email"
                                        prepend-icon="mdi-email">
                                    </v-text-field>

                                    <v-select label="Instruktur" v-model="editData.ID_INSTRUKTUR" :items="NamaInstrutur"
                                        item-text="NAMA_USER" item-value="ID_INSTRUKTUR">
                                    </v-select>

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
            window,
            deleteDialog: false,
            UpdateDialog: false,
            headers: [
                { text: "Kelas", value: "NAMA_KELAS" },
                { text: "Instrukur", value: "NAMA_USER" },
                { text: "Hari", value: "HARI_JADWAL_DEFAULT" },
                { text: "Sesi", value: "SESI_JADWAL" },
                { text: "Actions", value: "actions", sortable: false },
            ],
            editData: {
                ID_KELAS: "",
                ID_USER: "",
                ID_INSTRUKTUR: "",
                SESI_JADWAL: "",
                HARI_JADWAL_DEFAULT: "",
            },
            SESI_JADWAL: [{
                text: '06:00 - 08:00', value: 0
            }, {
                text: '08:00 - 10:00', value: 1
            }, {
                text: '10:00 - 12:00', value: 2
            }, {
                text: '12:00 - 14:00', value: 3
            }, {
                text: '14:00 - 16:00', value: 4
            }, {
                text: '18:00 - 20:00', value: 5
            }, {
                text: '20:00 - 22:00', value: 6
            }],

            HARI_JADWAL_DEFAULT: [{
                text: 'Senin', value: 0
            }, {
                text: 'Selasa', value: 1
            }, {
                text: 'Rabu', value: 3
            }, {
                text: 'Kamis', value: 4
            }, {
                text: 'Jumat', value: 5
            }, {
                text: 'Sabtu', value: 6
            }, {
                text: 'Minggu', value: 7
            }],
        };
    },

    methods: {
        openDeleteDialog(item) {
            this.deleteDialog = true;
            this.deleteTarget = item;
        },
        closeDeleteDialog() {
            this.deleteDialog = false;
            this.deleteTarget = {};
        },
        deleteProcess() {
            axios.delete('http://localhost:8000/api/jadwal_default/destroy/' + this.deleteTarget.ID_JADWAL)
                .then(response => {
                    this.jadwal_default = response.data.data;
                    toastr.success('Jadwal deleted successfully');
                    window.location.reload();
                })
                .catch(error => {
                    console.log(error);
                    toastr.error('User deletion failed');
                });
            this.closeDeleteDialog();
        },

        openUpdateDialog(item) {
            this.UpdateDialog = true; 
            this.editData.ID_KELAS = item.ID_KELAS
            this.editData.ID_INSTRUKTUR = item.ID_INSTRUKTUR
            this.editData.ID_USER = item.ID_USER
            this.editData.SESI_JADWAL = item.SESI_JADWAL
            this.editData.HARI_JADWAL_DEFAULT = item.HARI_JADWAL_DEFAULT
            this.updateTarget = item;
        
        },

        UpdateMemberProcess() {
            console.log('update process',this.editData);
            if (this.editData.ID_KELAS == "") {
                toastr.error('Please fill in the Kelas!')
                return;
            }
            if (this.editData.ID_INSTRUKTUR == "") {
                toastr.error('Please fill in the Instruktur!')
                return;
            }
            if (this.editData.SESI_JADWAL == null) {
                toastr.error('Please fill in the Sesi')
                return;
            }
            if (this.editData.HARI_JADWAL_DEFAULT == null) {
                toastr.error('Please fill in the Hari')
                return;
            }
            axios.put('http://localhost:8000/api/jadwal_default/update/' + this.editData.ID_JADWAL, {...this.editData} 
            )
                .then(() => {
                    console.log(this.editData)
                    toastr.success('You have successfully Update, Thanks You')
                    this.UpdateDialog = false;
                    window.location.reload();
                }
                ).catch(error => {
                    toastr.error('Update failed!')
                    console.log(error);

                }
                )

        },
    },

    setup() {
        let jadwalDefaultController = ref([]);
        let NamaKelas = ref([]);
        let NamaInstrutur = ref([]);
        // let displayMemberCard = ref([]);
        onMounted(() => {
            axios.get('http://localhost:8000/api/jadwal_default')
                .then(response => {
                    jadwalDefaultController.value = response.data.data
                    console.log(jadwalDefaultController.value);
                }).catch(error => {
                    console.log(error.response.data)
                }),
                axios.get('http://localhost:8000/api/kelas')
                    .then(response => {
                        NamaKelas.value = response.data.data
                    })
            axios.get('http://localhost:8000/api/instruktur')
                .then(response => {
                    NamaInstrutur.value = response.data.data
                })
        })
        return {
            jadwalDefaultController,
            NamaKelas,
            NamaInstrutur
        }
    }
}
</script>