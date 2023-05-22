<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="ma-12">
        <v-row>
            <v-col>
                <h1 class="mb-6">
                    Presensi Kelas
                    <span class="blue--text">GO</span><span class="green--text">FID</span>
                </h1>
            </v-col>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        </v-row>
        <template>
            <v-data-table :headers="headers" :items="presensiMemberGym" :search="search">

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
                    Are you sure you want Presensi Member Gym?
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
                { text: "ID Booking KELAS   ", value: "ID_BOOKING_KELAS" },
                { text: "NAMA USER", value: "NAMA_USER" },
                { text: "TANGGAL BOOKING KELAS", value: "TANGGAL_BOOKING_KELAS" },
                { text: "TANGGAL KELAS", value: "TANGGAL_KELAS" },
                { text: "Sesi", value: "SESI_BOOKING_KELAS" },
                { text: "NAMA KELAS", value: "NAMA_KELAS" },
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
            this.PresensiGymTarget = item;
        },
        closeVerifDialog() {
            this.VerifDialog = false;
            this.PresensiGymTarget = {};
        },

        PresensiGymProcess() {
            axios.put('http://localhost:8000/api/presensiKelas/' + this.PresensiGymTarget.ID_BOOKING_KELAS)
                .then(response => {
                    // console.log(this.PresensiGymTarget.ID_BOOKING_PRESENSI_GYM)
                    this.users = response.data.data;
                    toastr.success('User Presensi Gym Succes');
                    // window.location.reload();
                })
                .catch(error => {
                    console.log(error);
                    toastr.error('User Presensi Gym failed');
                });
            this.VerifDialog = false;
        },
    },


    setup() {
        let presensiMemberGym = ref([]);
        onMounted(() => {
            axios.get('http://localhost:8000/api/presensiKelas')
                .then(response => {
                    presensiMemberGym.value = response.data.data
                    // console.log(presensiMemberGym.value[0].ID_MEMBER)
                }).catch(error => {
                    console.log(error.response.data)
                })
        })

        function displayCetakPresensiGym(item) {
            console.log(item);
            this.StruckDialog = true
            var background = new Image()

            var sesiBookingGym = item.SESI_BOOKING_KELAS; 
            var startTime = new Date();
            startTime.setHours(6 + sesiBookingGym * 2, 0, 0); 
            var endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // Menambahkan 2 jam ke jam mulai     
            var startTimeString = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            var endTimeString = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setTimeout(() => {
                var canvas = document.createElement('canvas')
                //Ukuran Canvas
                canvas.width = 1000
                canvas.height = 550
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
                ctx.fillText('STRUK PRESENSI KELAS', 30, 170)


                ctx.font = '25px Futura'
                ctx.fillText('NO STRUCK        : ' + item.NO_STRUK_PRESENSI_KELAS, 30, 200)
                ctx.fillText('Tanggal                 : ' + item.TANGGAL_KELAS, 30, 230)


                ctx.fillText('MEMBER           : ' + item.ID_MEMBER + '/' + item.NAMA_USER, 30, 300)
                ctx.fillText('Kelas                    : ' + item.NAMA_KELAS, 30, 330)
                ctx.fillText('Instruktur             : ' + item.ID_INSTRUKTUR, 30, 360)
                ctx.fillText('Tarif                     : Rp. ' + item.HARGA_KELAS, 30, 390)
                ctx.fillText('Sisa Deposite       : Rp. ' + item.SISA_DEPOSIT_MEMBER, 30, 420)

                // ctx.fillText('SLOT WAKTU    : ' + startTimeString + ' - ' + endTimeString, 30, 330)
                this.memberCardOpenedCanvas = canvas
            }, 1000)
        }

        return {
            presensiMemberGym,
            displayCetakPresensiGym
        }
    }
}
</script>