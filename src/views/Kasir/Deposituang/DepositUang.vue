<template>
    <div class="pa-5">
        <v-card class="pa-3">
            <v-form>
                <v-select label="ID Member" :items="MemberController" item-text="NAMA_USER" item-value="ID_MEMBER"
                    v-model="formDepositeUang.ID_MEMBER" required></v-select>

                <v-text-field label="Nominal" required @input="checkPromo()" type="integer"
                    v-model="formDepositeUang.JUMLAH_DEPOSIT_UANG"></v-text-field>

                <v-select label="Promo" :items="PromoController" item-text="NAMA_PROMO" item-value="ID_PROMO" disabled
                    v-model="formDepositeUang.ID_PROMO" required></v-select>


                <v-text-field label="Bonus" v-model="formDepositeUang.BONUS_DEPOSIT_UANG" required disabled></v-text-field>
                <v-text-field label="Total" v-model="formDepositeUang.TOTAL_DEPOSIT" required disabled></v-text-field>
                <v-btn class="mr-4" type="submit" color="green"  @click="openVerifDialog()">
                    submit
                </v-btn>
                <v-btn @click="clearForm()" color="red">
                    clear
                </v-btn>
            </v-form>
        </v-card>
        <v-dialog v-model="VerifDialog" max-width="600" persistent>
            <v-card elevation="24">
                <v-card-title class="text-h5">
                    Anda Yakin Ingin Melakukan Deposite Uang?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="DepositeUangProcces()">
                        Yes
                    </v-btn>
                    <v-btn color="green darken-1" text @click="closeVerifDialog()">
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
        <template>
            <div class="text-right pt-3">
                <v-btn class="ma-2" color="primary" dark to="Deposite/print"> Print PDF
                </v-btn>
            </div>
        </template>

    </div>
</template>



<script>
import axios from 'axios'
import jsPDF from 'jspdf';
import router from '@/router'
import { ref, onMounted } from 'vue';
import toastr from 'toastr';
export default {
    name: "AdminCreateInstruktur",
    data: () => ({
        VerifDialog: false,
        formDepositeUang: {
            ID_MEMBER: "",
            ID_PEGAWAI: "",
            PEG_ID_USER: "",
            MEM_ID_USER: "",
            ID_PROMO: "",
            JUMLAH_DEPOSIT_UANG: "",
            BONUS_PROMO: "",
            TOTAL_DEPOSIT: "",
            TANGGAL_DEPOSIT_UANG: new Date(),

        },
        document,
        window,
    }
    ),
    methods: {

        checkPromo() {
            let LocalPromo = this.updatePromo();
            try {
                this.formDepositeUang.ID_PROMO = LocalPromo.ID_PROMO;
                this.formDepositeUang.BONUS_DEPOSIT_UANG = LocalPromo.BONUS_PROMO;
                this.formDepositeUang.TOTAL_DEPOSIT = parseInt(this.formDepositeUang.JUMLAH_DEPOSIT_UANG) + parseInt(LocalPromo.BONUS_PROMO)
            } catch {
                this.formDepositeUang.ID_PROMO = null;
                this.formDepositeUang.BONUS_DEPOSIT_UANG = 0;
                this.formDepositeUang.TOTAL_DEPOSIT = this.formDepositeUang.JUMLAH_DEPOSIT_UANG;
            }
        },
        // },

        clearForm() {
            this.formDepositeUang.ID_MEMBER = "",
                this.formDepositeUang.JUMLAH_DEPOSIT_UANG = ""
            this.formDepositeUang.BONUS_DEPOSIT_UANG = "";
            this.formDepositeUang.ID_PROMO = "";
            this.formDepositeUang.TOTAL_DEPOSIT = "";
        },

        updatePromo() {
            let data = this.PromoController
            let pm = null
            data = data.filter((dt) => dt.JENIS_PROMO == 0);
            data.forEach((value) => {
                if (value.MINIMAL_DEPOSIT_PROMO <= this.formDepositeUang.JUMLAH_DEPOSIT_UANG && (pm === null || value.MINIMAL_DEPOSIT_PROMO > pm.MINIMAL_DEPOSIT_PROMO)) {
                    pm = value;
                    // console.log(pm.MINIMAL_DEPOSIT_PROMO, pm.NAMA_PROMO)
                }
            })
            return pm;
        },

        openVerifDialog() {
            this.VerifDialog = true;
        },
        closeVerifDialog() {
            this.VerifDialog = false;
            this.deleteTarget = {};
        },


        DepositeUangProcces() {
            const regexNominalUang = /^[0-9]+$/;
            if (this.formDepositeUang.ID_MEMBER == "") {
                toastr.error('Harap Masukkan Member')
                return;
            }
            if (this.formDepositeUang.JUMLAH_DEPOSIT_UANG == "") {
                toastr.error('Harap Masukkan Nominal Deposit')
                return;
            } else if (this.formDepositeUang.JUMLAH_DEPOSIT_UANG <= 500000) {
                toastr.error('Deposite Minimal Rp. 500.000')
            }
            else if (!regexNominalUang.test(this.formDepositeUang.JUMLAH_DEPOSIT_UANG)) {
                toastr.error('Jumlah Deposit Anda tidak Sesuai');
                return;
            }

            let SelectedMember = this.MemberController.filter(i => i.ID_MEMBER == this.formDepositeUang.ID_MEMBER);
            let dataUser = JSON.parse(sessionStorage.getItem("users"));
            this.formDepositeUang.ID_MEMBER = SelectedMember[0].ID_MEMBER;
            this.formDepositeUang.MEM_ID_USER = SelectedMember[0].ID_USER;
            this.formDepositeUang.ID_PEGAWAI = dataUser.ID_PEGAWAI;
            this.formDepositeUang.PEG_ID_USER = dataUser.ID_USER;
            // console.log('Ini Data nya',this.formDepositeUang);

            axios.post('http://localhost:8000/api/depositeUang', this.formDepositeUang)
                .then(() => {
                    toastr.success('You have successfully registered, Thanks You')
                    router.push('/Kasir/deposit')
                    this.VerifDialog = false;
                    // this.cetakStrukDepositUang();
                    this.formDepositeUang.ID_MEMBER = "";
                    this.formDepositeUang.BONUS_DEPOSIT_UANG = "";
                    this.formDepositeUang.JUMLAH_DEPOSIT_UANG = "";
                    this.formDepositeUang.ID_PROMO = "";
                    this.formDepositeUang.TOTAL_DEPOSIT = "";
                }).catch(error => {
                    toastr.error('Deposit Failed')
                    console.log(error);
                })

        },

        cetakStrukDepositUang() {
            console.log('cetak struk')
            var elementHTML = document.querySelector('#printtarget');
            elementHTML.style.display = "block";
            elementHTML.style.fontSize = '5px';

            //Spasi
            elementHTML.style.lineHeight = '1.2';
            elementHTML.style.margin = '0';
            elementHTML.style.padding = '0';

            let doc = new jsPDF({
                orientation: 'l', // orientasi landscape
                unit: 'mm', // satuan millimeter
                format: ['300', '100'], // ukuran kertas A4
            });

            doc.html(elementHTML, {
                callback: function (doc) {
                    doc.save('struk.pdf');
                    elementHTML.style.display = "none";
                },
                x: 10,
                y: 10
            });
            console.log('akhir dari cetak pdf')
        },
    },
    setup() {
        let MemberController = ref([]);
        let UserController = ref([]);
        let PegawaiController = ref([]);
        let PromoController = ref([]);

        onMounted(() => {
            axios.get('http://localhost:8000/api/member')
                .then(response => {
                    MemberController.value = response.data.data
                }).catch(error => {
                    console.log(error.response.data)
                }),
                axios.get('http://localhost:8000/api/user')
                    .then(response => {
                        UserController.value = response.data.data
                        console.log(UserController);
                    })
            axios.get('http://localhost:8000/api/pegawai')
                .then(response => {
                    PegawaiController.value = response.data.data
                })
            axios.get('http://localhost:8000/api/promo')
                .then(response => {
                    PromoController.value = response.data.data
                })
            // console.log(sessionStorage.getItem('users'))
        })


        return {
            MemberController,
            UserController,
            PegawaiController,
            PromoController,
        }
    },
};
</script>
