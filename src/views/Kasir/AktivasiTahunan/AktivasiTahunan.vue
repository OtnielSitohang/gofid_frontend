<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="ma-12">
        <v-row>
            <v-col>
                <h1 class="mb-6">
                    Print Struck
                    <span class="blue--text">GO</span><span class="red--text">FID</span>
                </h1>
            </v-col>
            <v-col align="right">
                <v-btn class="ma-2" color="primary" to="AktivasiTahunan/createAktivasi">AKTIVASI MEMBER<v-icon>mdi-plus</v-icon></v-btn>
            </v-col>
        </v-row>
        <template>
            <v-data-table :headers="headers" :items="AktivasiTahunan">

                <template v-slot:item.TANGGAL_AKTIVASI_MEMBERSHIP="{ item }">
                    {{ item.HARI_JADWAL_DEFAULT === null ? 'Belum Aktivasi'  : (item.TANGGAL_AKTIVASI_MEMBERSHIP) }}
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-btn x-small @click="displayCetakStruck(item)"  v-show="item.TANGGAL_AKTIVASI_MEMBERSHIP" color="green">
                        <v-icon>mdi-printer</v-icon>
                    </v-btn>
                </template>

        </v-data-table>
        </template>

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
// import jsPDF from 'jspdf';
// import { response } from "express";
// import toastr from 'toastr';

export default {
    name: "InstrukturReadComponent",
    data() {
        return {
            router,
            window,
            StruckDialog: false,
            headers: [
                { text: "ID MEMBERSHIP", value: "ID_MEMBERSHIP" },
                { text: "ID MEMBER", value: "ID_MEMBER" },
                { text: "ID PEGAWAI", value: "ID_PEGAWAI" },
                { text: "AWAL MEMBERSHIP", value: "TANGGAL_AKTIVASI_MEMBERSHIP" },
                { text: "AKHIR MEMBERSHIP", value: "TANGGAL_KADALUARSA_MEMBERSHIP" },
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
        
        
    },

    setup() {
        let AktivasiTahunan = ref([]);
        onMounted(() => {
            axios.get('http://localhost:8000/api/aktivasi')
            .then(response => {
                AktivasiTahunan.value = response.data.data
                console.log(AktivasiTahunan.value[0].TANGGAL_AKTIVASI_MEMBERSHIP)
                }).catch(error => {
                    console.log(error.response.data)
                })
        })

        function displayCetakStruck(item) {
            this.StruckDialog = true
            var background = new Image()
            setTimeout(() => {
                var canvas = document.createElement('canvas')
                //Ukuran Canvas
                canvas.width = 1123
                canvas.height = 410
                document.getElementById('CetakStruck').appendChild(canvas)
                var ctx = canvas.getContext('2d')
                ctx.globalCompositeOperation = 'darken'
                ctx.drawImage(background, 0, 0)
                //Set Huruf dan Font

                //Tittle
                ctx.font = 'bold  25px Futura'
                ctx.fillText('GOFID', 30, 60)

                ctx.font = '25px Futura'
                ctx.fillText('Jl. CentralPark No.10 Yogyakarta', 30, 95)
                ctx.fillText('No Struck     : ' + item.NO_STRUK_MEMBERSHIP, 700, 60)
                ctx.fillText('Tanggal        : ' + new Date(), 700, 95)

                ctx.fillText('MEMBER                           : ' + item.ID_MEMBER, 30, 200)
                ctx.fillText('AKTIVASI TAHUNAN     : Rp.3.000.000', 30, 240)
                ctx.fillText('MASA AKTIF MEMBER : ' + item.TANGGAL_KADALUARSA_MEMBERSHIP, 30, 280)
                
                ctx.fillText((item.ID_PEGAWAI), 800, 350)
                this.memberCardOpenedCanvas = canvas
            }, 1000)
        }

        
        return {
            AktivasiTahunan,
            displayCetakStruck
        }
    }
}
</script>