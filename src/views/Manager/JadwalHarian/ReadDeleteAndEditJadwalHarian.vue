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
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
            <v-col align="right">
                <v-btn class="ma-2" color="primary" @click="GenerateJadwalHarian()">Generate Jadwal<v-icon></v-icon></v-btn>
            </v-col>
        </v-row>
        <template>
            <v-data-table :headers="headers" :items="JadwalHarianController" :search="search">
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

                <template v-slot:item.STATUS="{ item }">
                    <!-- {{ item.STATUS == 0 ? 'Tersedia' : 'Libur' }} -->
                    {{ item.STATUS == 0 ? 'Tersedia' : 'Libur'  }}
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-btn x-small class="mr-2"  v-show="!item.STATUS" @click="openDeleteDialog(item)">LIBURKAN
                        <v-icon dark>mdi-pencil</v-icon>
                    </v-btn>
                </template>

            </v-data-table>
        </template>

         <!-- PerifDialog -->
         <v-dialog v-model="VerifDialog" max-width="320" persistent>
            <v-card>
                <v-card-title class="text-h5">
                    Anda Yakin ingin meliburkan Kelas ini?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="closeDeleteDialog()">
                        Cancel
                    </v-btn>
                    <v-btn color="green darken-1" text @click="updateToHolidayProcess()">
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
import toastr from 'toastr';
// import { response } from "express";
// import toastr from 'toastr';

export default {
    name: "InstrukturReadComponent",
    data() {
        return {
            router,
            window,
            search: '',
            VerifDialog: false,
            UpdateDialog: false,
            headers: [
                { text: "Kelas", value: "NAMA_KELAS" },
                { text: "Instrukur", value: "NAMA_USER" },
                { text: "Hari", value: "HARI_JADWAL_DEFAULT" },
                { text: "Sesi", value: "SESI_JADWAL" },
                { text: "Status", value: "STATUS" },
                { text: "Actions", value: "actions", sortable: false },
            ],
            deleteTarget : {},
            editData: {
                ID_KELAS: null,
                ID_INSTRUKTUR: null,
                ID_USER: null,
                HARI_JADWAL_DEFAULT: null,
                SESI_JADWAL: null,
                STATUS: null,
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
                text: 'Rabu', value: 2
            }, {
                text: 'Kamis', value: 3
            }, {
                text: 'Jumat', value: 4
            }, {
                text: 'Sabtu', value: 5
            }, {
                text: 'Minggu', value: 6
            }],
            STATUS: [{
                text: 'Libur', value: '1'
            }, {
                text: 'Tersedia', value: '0'
            }
            // {
            //     text: 'Tersedia', value: '0'
            // }
            ]
        };
    },

    methods: {
        openUpdateDialog(item) {
            this.UpdateDialog = true;
            this.editData.ID_KELAS = item.ID_KELAS
            this.editData.ID_INSTRUKTUR = item.ID_INSTRUKTUR
            this.editData.ID_USER = item.ID_USER
            this.editData.SESI_JADWAL = item.SESI_JADWAL
            this.editData.HARI_JADWAL_DEFAULT = item.HARI_JADWAL_DEFAULT
            this.editData.STATUS = item.STATUS
            this.updateTarget = item;
        },

        openDeleteDialog(item) {
            this.VerifDialog = true;
            this.deleteTarget = item;
        },

        closeDeleteDialog() {
            this.VerifDialog = false;
            this.deleteTarget = {};
        },


        updateToHolidayProcess(){
            axios.put('http://localhost:8000/api/jadwalHarian/update/' + this.deleteTarget.ID_JADWAL)
            .then((response) =>{
                console.log('ini di then', response);
                toastr.success('Kelas Telah di Liburkan')
                this.VerifDialog = false;
            }).catch(error => {
                toastr.error('Kelas Batal di Liburkan')
                console.log(error);
            })
            // this.window.location.reload();
        },

        GenerateJadwalHarian(){
            axios.post('http://localhost:8000/api/jadwalHariangenerate')
            .then((response)=>{
                    toastr.success('Jadwal Sudah di Generate')
                    console.log('ini di then', response);
            }).catch(error =>{
                toastr.error('Jadwal Sudah Pernah di Generate')
                console.log(error);
            })
        }
    },

    setup() {
        let JadwalHarianController = ref([]);
        let NamaKelas = ref([]);
        let NamaInstrutur = ref([]);
        // let displayMemberCard = ref([]);
        onMounted(() => {
            axios.get('http://localhost:8000/api/jadwalHarian')
                .then(response => {
                    JadwalHarianController.value = response.data.data
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
            JadwalHarianController,
            NamaKelas,
            NamaInstrutur
        }
    }
}
</script>