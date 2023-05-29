<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="ma-12">
        <v-row>
            <v-col>
                <h1 class="mb-6">
                    Presensi Kelas Paket
                    <span class="blue--text">GO</span><span class="green--text">FID</span>
                </h1>
            </v-col>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        </v-row>
        <template>
            <v-data-table :headers="headers" :items="PresensiKelasPaket" :search="search">
                <template v-slot:item.SESI_BOOKING_KELAS="{ item }">
                    {{ item.SESI_BOOKING_KELAS == 0 ? '06:00 - 08:00' : (item.SESI_BOOKING_KELAS == 1 ? '08:00 - 10:00' :
                        (item.SESI_BOOKING_KELAS == 2 ? '10:00 - 12:00' : (item.SESI_BOOKING_KELAS == 3 ? '12:00 - 14:00' :
                            (item.SESI_BOOKING_KELAS
                                == 4 ? '14:00 - 16:00' : (item.SESI_BOOKING_KELAS == 5 ? '18:00 - 20:00' : '20:00 - 22:00'))))) }}
                </template>
                <template v-slot:item.STATUS_PRESENSI="{ item }">
                    {{ item.STATUS_PRESENSI == 0 ? 'Belum Di Presensi' : 'Sudah di Presensi' }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-btn x-small class="mr-2" @click="openVerifDialog(item)" v-if="item.STATUS_PRESENSI !== 1"
                        color="green"> Presensi
                        <v-icon color="white">mdi-rotate-left</v-icon>
                    </v-btn>
                    <v-btn x-small class="mr-2" @click="displayCetakPresensiGym(item)" v-if="item.STATUS_PRESENSI === 1"
                        color="green"> Cetak
                        <v-icon color="white">mdi-rotate-left</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </template>

        <!-- PerifDialog -->
        <v-dialog v-model="VerifDialog" max-width="500" persistent>
            <v-card>
                <v-card-title class="text-h5">
                    Presensi Member Paket Kelas?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="closeVerifDialog()">
                        Cancel
                    </v-btn>
                    <v-btn color="green darken-1" text @click="PresensiGymProcess()">
                        Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="StruckDialog" width="auto" persistent>
            <v-card>
                <div id="CetakStruck">
                </div>
                <v-card-action>
                    <v-btn color="green-darken-1" variant="text" @click="OpenCardWindow()">
                        <v-icon left>mdi-printer</v-icon> Print
                    </v-btn>
                    <v-btn color="green-darken-1" variant="text" @click="CloseCardWindow()">
                        <v-icon left>mdi-close</v-icon> Close
                    </v-btn>
                </v-card-action>
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
    name: "PresensiGym",
    data() {
        return {
            router,
            window,

            VerifDialog: false,
            StruckDialog: false,
            search: '',
            headers: [
                { text: "ID Booking KELAS PAKET  ", value: "NO_STRUK_DEPOSIT_KELAS" },
                { text: "NAMA USER", value: "user.NAMA_USER" },
                { text: "TANGGAL BOOKING KELAS", value: "TANGGAL_DEPOSIT_KELAS" },
                { text: "NAMA KELAS", value: "k_e_l_a_s.NAMA_KELAS" },
                { text: "Instruktur", value: "instruktur.NAMA_USER" },
                // { text: "Total Kelas Paket", value: "TOTAL_KELAS" },
                { text: "Status Presensi", value: "STATUS_PRESENSI" },
                { text: "Actions", value: "actions", sortable: false },
            ],
        };
    },

    methods: {
        OpenCardWindow() {
            var memberCardPrintWindow = window.open('', 'PRINT', 'height=272,width=430')
            memberCardPrintWindow.document.write('<img src="' + this.memberCardOpenedCanvas.toDataURL() + '">')
            memberCardPrintWindow.print()
            memberCardPrintWindow.close()
        },

        CloseCardWindow() {
            this.StruckDialog = false;
            window.location.reload();
        },

        openVerifDialog(item) {
            this.VerifDialog = true;
            this.PresensiKelasTarget = item;
            console.log(this.PresensiKelasPaket)
        },
        closeVerifDialog() {
            this.VerifDialog = false;
            this.PresensiKelasTarget = {};
        },

        PresensiGymProcess() {
            axios.put('http://localhost:8000/api/presensiKelasPaket/' + this.PresensiKelasTarget.NO_STRUK_DEPOSIT_KELAS)
                .then(response => {
                    // console.log(this.PresensiKelasTarget.ID_BOOKING_PRESENSI_GYM)
                    this.users = response.data.data;
                    toastr.success('User Presensi Kelas Succes');
                    // window.location.reload();
                })
                .catch(error => {
                    console.log(error);
                    toastr.error('User Presensi Kelas failed');
                });
            this.VerifDialog = false;
        },
    },


    setup() {
        let PresensiKelasPaket = ref([]);
        onMounted(() => {
            axios.get('http://localhost:8000/api/presensiKelasPaket')
                .then(response => {
                    PresensiKelasPaket.value = response.data.data
                    console.log(PresensiKelasPaket.value[0])
                }).catch(error => {
                    console.log(error.response.data)
                })
        })

        function displayCetakPresensiGym(item) {
            console.log(item);
            this.StruckDialog = true
            var background = new Image()
            var TimeNow = new Date();

            // Mengatur pengaturan waktu untuk GMT+7 (Indonesia Barat)
            var options = { timeZone: 'Asia/Jakarta' };

            // Mendapatkan tanggal dan waktu dalam format sesuai pengaturan waktu
            var formattedDateTime = TimeNow.toLocaleString('id-ID', options);
            var sesiBookingGym = item.SESI_BOOKING_KELAS;
            var startTime = new Date();
            startTime.setHours(6 + sesiBookingGym * 2, 0, 0);
            setTimeout(() => {
                var canvas = document.createElement('canvas')
                //Ukuran Canvas
                canvas.width = 1000
                canvas.height = 500
                document.getElementById('CetakStruck').appendChild(canvas)

                var ctx = canvas.getContext('2d')
                ctx.globalCompositeOperation = 'darken'
                ctx.drawImage(background, 0, 0)

                //Tittle
                ctx.font = 'bold  25px Futura'
                ctx.fillText('GOFIT', 30, 60)

                ctx.font = '25px Futura'
                ctx.fillText('Jl. CentralPark No.10 Yogyakarta', 30, 95)

                ctx.font = ' bold 25px Futura'
                ctx.fillText('STRUK PRESENSI KELAS PAKET', 30, 170)


                ctx.font = '25px Futura'
                ctx.fillText('NO STRUCK        : ' + item.NO_STRUK_DEPOSIT_KELAS, 30, 200)
                ctx.fillText('Tanggal                 : ' + formattedDateTime, 30, 230)


                ctx.fillText('MEMBER           : ' + item.m_e_m_b_e_r.ID_MEMBER + ' / ' + item.user.NAMA_USER, 30, 300)
                ctx.fillText('Kelas                    : ' + item.k_e_l_a_s.NAMA_KELAS, 30, 330)
                ctx.fillText('Instruktur             : ' + item.instruktur.NAMA_USER, 30, 360)
                ctx.fillText('Sisa deposite        : ' + item.TOTAL_KELAS + 'x', 30, 390)
                ctx.fillText('Berlaku sampai    : ' + item.TANGGAL_KADALUARSA_DEPOSIT_KEL, 30, 420)

                // ctx.fillText('SLOT WAKTU    : ' + startTimeString + ' - ' + endTimeString, 30, 330)
                this.memberCardOpenedCanvas = canvas
            }, 1000)
        }

        return {
            PresensiKelasPaket,
            displayCetakPresensiGym
        }
    }
}
</script>