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
                <v-btn class="ma-2" color="primary" to="../deposit"><v-icon>mdi-plus</v-icon></v-btn>
            </v-col>
        </v-row>
        <template>
            <v-data-table :headers="headers" :items="DepositUangController">
                <template v-slot:item.actions="{ item }">
                    <v-btn x-small @click="displayCetakStruck(item)">
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
                { text: "No Struck", value: "NO_STRUK_DEPOSIT_UANG" },
                { text: "ID MEMBER", value: "ID_MEMBER" },
                { text: "ID PEGAWAI", value: "ID_PEGAWAI" },
                { text: "JUMLAH DEPOSITE", value: "JUMLAH_DEPOSIT_UANG" },
                { text: "BONUS", value: "BONUS_DEPOSIT_UANG" },
                { text: "TANGGAL DEPOSIT", value: "TANGGAL_DEPOSIT_UANG" },
                { text: "TOTAL DEPOSIT", value: "TOTAL_DEPOSIT" },
                { text: "Actions", value: "actions", sortable: false },
            ],
            // editData: {
            //     NO_STRUK_DEPOSIT_UANG: "",
            //     ID_MEMBER: "",
            //     ID_PEGAWAI: "",
            //     JUMLAH_DEPOSIT_UANG: "",
            //     BONUS_DEPOSIT_UANG: "",
            //     TANGGAL_DEPOSIT_UANG: "",
            //     TOTAL_DEPOSIT: "",
            // },
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
        let DepositUangController = ref([]);
        onMounted(() => {
            axios.get('http://localhost:8000/api/indexDepositeUang')
                .then(response => {
                    DepositUangController.value = response.data.data
                    // console.log(DepositUangController.value);
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
                canvas.width = 1200
                canvas.height = 400
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
                ctx.fillText('No Struck     : ' + item.NO_STRUK_DEPOSIT_UANG, 700, 60)
                ctx.fillText('Tanggal        : ' + item.TANGGAL_DEPOSIT_UANG, 700, 95)

                ctx.fillText('MEMBER ID          : ' + item.ID_MEMBER, 30, 200)
                ctx.fillText('DEPOSIT                : ' + item.JUMLAH_DEPOSIT_UANG, 30, 240)
                ctx.fillText('BONUS DEPOSIT : ' + item.BONUS_DEPOSIT_UANG, 30, 280)
                ctx.fillText('TOTAL DEPOSIT  : ' + item.TOTAL_DEPOSIT, 30, 320)
                
                ctx.fillText((item.ID_PEGAWAI), 800, 400)
                this.memberCardOpenedCanvas = canvas
            }, 1000)
        }

        
        return {
            DepositUangController,
            displayCetakStruck
        }
    }
}
</script>