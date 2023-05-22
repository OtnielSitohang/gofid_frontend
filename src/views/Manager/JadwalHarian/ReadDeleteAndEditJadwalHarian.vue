<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="ma-12">
        <v-row>
            <v-col>
                <h1 class="mb-6">
                    Jadwal Harian
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
                <!-- eslint-disable-next-line  -->
                <template v-slot:item.HARI_JADWAL_HARIAN="{ item }">
                    {{ item.HARI_JADWAL_HARIAN == 0 ? 'Senin' : (item.HARI_JADWAL_HARIAN == 1 ? 'Selasa' :
                        (item.HARI_JADWAL_HARIAN == 2 ? 'Rabu' : (item.HARI_JADWAL_HARIAN == 3 ? 'Kamis' :
                            (item.HARI_JADWAL_HARIAN == 4 ? 'Jumat' : (item.HARI_JADWAL_HARIAN == 5 ? 'Sabtu' : 'Minggu'))))) }}
                </template>

                <!-- eslint-disable-next-line  -->
                <template v-slot:item.SESI_JADWAL="{ item }">
                    {{ item.SESI_JADWAL == 0 ? '06:00 - 08:00' : (item.SESI_JADWAL == 1 ? '08:00 - 10:00' :
                        (item.SESI_JADWAL == 2 ? '10:00 - 12:00' : (item.SESI_JADWAL == 3 ? '12:00 - 14:00' : (item.SESI_JADWAL
                            == 4 ? '14:00 - 16:00' : (item.SESI_JADWAL == 5 ? '18:00 - 20:00' : '20:00 - 22:00'))))) }}
                </template>

                <!-- eslint-disable-next-line  -->
                <template v-slot:item.STATUS="{ item }">
                    <!-- {{ item.STATUS == 0 ? 'Tersedia' : 'Libur' }} -->
                    {{ item.STATUS == 0 ? 'Tersedia' : 'Libur' }}
                </template>

                <!-- eslint-disable-next-line  -->
                <template v-slot:item.actions="{ item }">
                    <v-btn x-small class="mr-2" color="green" v-show="!item.STATUS"
                        @click="OpenLiburkanDialog(item)">LIBURKAN
                        <v-icon dark>mdi-pencil</v-icon>
                    </v-btn>

                    <!-- <v-btn x-small class="mr-2" color="yellow" v-show="!item.STATUS"
                        @click="openUpdateInstrtukruPengganti(item)">Ganti Instruktur
                        <v-icon dark>mdi-tune</v-icon>
                    </v-btn> -->
                </template>

            </v-data-table>
        </template>

        <!-- PerifDialog -->
        <v-dialog v-model="LiburDialog" max-width="320" persistent>
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


        <!-- UpdateInstrukturDialog -->
        <!-- <template>
            <v-form>
                <v-dialog v-model="UpdateInstrukturDialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
                    <v-card class="text-center">
                        <v-toolbar dark color="primary">
                            <v-btn icon dark @click="UpdateInstrukturDialog = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <v-toolbar-title>Update Jadwal harian</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                                <v-btn variant="text" color="primary" @click="IzinInstrukturProcess(item)">
                                    Ajukan Izin
                                </v-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                        <br>
                        <br>
                        <v-card class="text-center pa-3">
                            <v-text-field v-model="editData.NAMA_KELAS" label="Kelas" prepend-icon="mdi-key" disabled>
                            </v-text-field>
                            <v-text-field v-model="editData.NAMA_USER" label="Instruktur" prepend-icon="mdi-account"
                                disabled>
                            </v-text-field>

                            <v-select label="HARI" v-model="editData.HARI_JADWAL_HARIAN" :items="HARI_JADWAL_HARIAN"  prepend-icon="mdi-account"
                                disabled>
                            </v-select>

                            <v-select label="HARI" v-model="editData.SESI_JADWAL" :items="SESI_JADWAL"  prepend-icon="mdi-account"
                                disabled>
                            </v-select>

                            <v-select label="Instruktur Pengganti" v-model="editData.ID_INSTRUKTUR_PENGGANTI" :items="NamaInstrutur" prepend-icon="mdi-account"
                                item-text="NAMA_USER" item-value="ID_INSTRUKTUR">
                            </v-select>

                            <v-text-field v-model="editData.KETERANGAN_IZIN" label="Keterangan Izin" prepend-icon="mdi-key">
                            </v-text-field>
                        </v-card>
                    </v-card>
                </v-dialog>
            </v-form>
        </template> -->

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
            LiburDialog: false,
            UpdateInstrukturDialog: false,
            UpdateDialog: false,
            headers: [
                { text: "Kelas", value: "NAMA_KELAS" },
                { text: "Instrukur", value: "NAMA_USER" },
                { text: "Hari", value: "HARI_JADWAL_HARIAN" },
                { text: "Sesi", value: "SESI_JADWAL" },
                { text: "Status", value: "STATUS" },
                { text: "Actions", value: "actions", sortable: false },
            ],
            deleteTarget: {},
            editData: {
                ID_KELAS: null,
                ID_INSTRUKTUR: null,
                ID_USER: null,
                HARI_JADWAL_HARIAN: null,
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

            HARI_JADWAL_HARIAN: [{
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
            ],

            editJadwalHarian: {
                ID_KELAS: null,
                ID_INSTRUKTUR: null,
                ID_USER: null,
                HARI_JADWAL_HARIAN: null,
                SESI_JADWAL: null,
                STATUS: null,
                ID_INSTRUKTUR_PENGGANTI: null,
            },
        };
    },

    methods: {

        // openUpdateInstrtukruPengganti(item) {
        //     console.log(item);
        //     this.UpdateInstrukturDialog = true;
        //     this.UpdateDialog = true;
        //     this.editData.ID_KELAS = item.ID_KELAS
        //     this.editData.NAMA_KELAS = item.NAMA_KELAS
        //     this.editData.NAMA_USER = item.NAMA_USER
        //     this.editData.ID_INSTRUKTUR = item.ID_INSTRUKTUR
        //     this.editData.ID_INSTRUKTUR_PENGGANTI = item.ID_INSTRUKTUR_PENGGANTI
        //     this.editData.ID_USER = item.ID_USER
        //     this.editData.SESI_JADWAL = item.SESI_JADWAL
        //     this.editData.HARI_JADWAL_HARIAN = item.HARI_JADWAL_HARIAN
        //     this.editData.KETERANGAN_IZIN = item.KETERANGAN_IZIN
        //     this.deleteTarget = item;
        // },

        // CloseUpdateInstrtukruPengganti() {
        //     this.UpdateInstrukturDialog = false;
        //     this.deleteTarget = {};
        // },

        OpenLiburkanDialog(item) {
            this.LiburDialog = true;
            this.deleteTarget = item;
        },

        closeDeleteDialog() {
            this.LiburDialog = false;
            this.deleteTarget = {};
        },


        updateToHolidayProcess() {
            axios.put('http://localhost:8000/api/jadwalHarian/update/' + this.deleteTarget.ID_JADWAL)
                .then((response) => {
                    console.log('ini di then', response);
                    toastr.success('Kelas Telah di Liburkan')
                    this.LiburDialog = false;
                }).catch(error => {
                    toastr.error('Kelas Batal di Liburkan')
                    console.log(error);
                })
            // this.window.location.reload();
        },

        // IzinInstrukturProcess(){

        //     // if
        //     let FormData = new FormData()
        //     FormData.append('ID_INSTRUKTUR' , this.ID_INSTRUKTUR)
        //     FormData.append('INS_ID_USER' , this.ID_USER)
        //     // FormData.append('ID_INSTRUKTUR_PENGGANTI' , this.ID_INSTRUKTUR_PENGGANTI)
        //     // FormData.append('INS_PENGGANTI_ID_USER' , this.INS_PENGGANTI_ID_USER)
        //     FormData.append('HARI_IZIN' , this.HARI_JADWAL_HARIAN)
        //     FormData.append('TANGGAL_IZIN' , this.TANGGAL_JADWAL_HARIAN)
        //     FormData.append('SESI_IZIN' , this.SESI_JADWAL)
        //     FormData.append('KETERANGAN_IZIN' , this.KETERANGAN_IZIN)
        //     axios.post('http://localhost:8000/api/ijininstruktur/create')


        // },

        GenerateJadwalHarian() {
            axios.post('http://localhost:8000/api/jadwalHariangenerate')
                .then((response) => {
                    console.log(response.data.success);
                    if (response.data.success == false) {
                        toastr.error('Jadwal Sudah Pernah di Generate')
                    } else {
                        toastr.success('Jadwal Sudah di Generate')
                    }
                }).catch(error => {
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