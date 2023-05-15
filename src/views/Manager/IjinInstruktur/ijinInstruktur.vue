<template>
    <div>
        <v-card max>
            <v-card-title>
                Izin Instruktur
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                    hide-details></v-text-field>
                <v-spacer></v-spacer>
            </v-card-title>
            <v-data-table :headers="headers" :items="dataIzin" :search="search">

                <template v-slot:item.STATUS_IZIN ="{ item }">
                    {{ item.STATUS_IZIN == 0 ? 'Belum Di Konfirmasi' : (item.STATUS_IZIN == 1 ? 'Izin Di Berikan' : 'Izin Di Tolak') }}
                </template>

                <template v-slot:item.SESI_IZIN="{ item }">
                    {{ item.SESI_IZIN == 0 ? '06:00 - 08:00' : (item.SESI_IZIN == 1 ? '08:00 - 10:00' :
                        (item.SESI_IZIN == 2 ? '10:00 - 12:00' : (item.SESI_IZIN == 3 ? '12:00 - 14:00' : (item.SESI_IZIN
                            == 4 ? '14:00 - 16:00' : (item.SESI_IZIN == 5 ? '18:00 - 20:00' : '20:00 - 22:00'))))) }}
                </template>

                <template v-slot:[`item.actions`]="{ item }">

                    <v-btn color="white" @click="dialogConfirm2 = true" v-if="item.STATUS_IZIN == '0'">
                        Confirm
                    </v-btn>

                    <!--Dialog Confirm Edit -->
                    <v-dialog v-model="dialogConfirm2" persistent max-width="420px">
                        <v-card color="white">
                            <v-card-title>
                                <span class="headline">Ingin Mengedit Jadwal ?</span>
                            </v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green" text @click="dialogConfirm2 = false"> Cancel </v-btn>
                                <v-btn color="red darken-1" text @click="acceptHandler(item)"> Accept </v-btn>
                                <v-btn color="yellow darken-1" text @click="rejectHandler(item)"> Reject </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>
  
<script>

import { ref } from 'vue';
import axios from 'axios';

export default {

    data() {
        return {
            dialogConfirm2: false,
            color: '',
            search: '',
            headers: [
                {
                    text: 'ID Izin',
                    align: 'start',
                    sortable: false,
                    value: 'ID_IJIN_INSTRUKTUR',
                },
                { text: 'Nama Instruktur', value: 'instruktur_user_name.NAMA_USER' },
                { text: 'Instruktur Pengganti', value: 'instruktur_pengganti_user_name.NAMA_USER' },
                { text: 'Hari Izin', value: 'HARI_IZIN' },
                { text: 'Tanggal Pengajuan Izin', value: 'TANGGAL_PENGAJUAN_IZIN' },
                { text: 'Tanggal Izin', value: 'TANGGAL_IZIN' },
                { text: 'Jam Sesi Izin', value: 'SESI_IZIN' },
                { text: 'Keterangan Izin', value: 'KETERANGAN_IZIN' },
                { text: 'Status Konfirmasi', value: 'STATUS_IZIN' },
                { text: 'Aksi', value: 'actions' },

            ],
            editId: '',
            deleteId: '',
            dataIzin: ref([]),
            // member : {}
            // router: useRouter(),

        }
    },
    methods: {
        async getDataIzin() {
            const url = "http://127.0.0.1:8000/api/ijininstruktur";
            const request = await axios.get(url)
            console.log(request.data.data)
            this.dataIzin = request.data.data
        },

        async acceptHandler(item) {
            const url = `http://127.0.0.1:8000/api/ijininstruktur/${item.ID_IJIN_INSTRUKTUR}`;
            const request = await axios.put(url, { STATUS_IZIN: 1 })
            console.log(request.data.data)
            this.dialogConfirm2 = false;
            this.getDataIzin();
        },
        async rejectHandler(item) {
            const url = `http://127.0.0.1:8000/api/ijininstruktur/${item.ID_IJIN_INSTRUKTUR}`;
            const request = await axios.put(url, { STATUS_IZIN: 2 })
            console.log(request.data.data)
            this.dialogConfirm2 = false;
            this.getDataIzin();
        },

    },
    mounted() {
        this.getDataIzin();
    }
}
</script>