<template>
    <div class="pa-5">
        <v-card class="pa-3">
            <v-form>
                <v-select label="ID Member" :items="MemberController" item-text="NAMA_USER" item-value="ID_MEMBER"
                    v-model="formDepositeKelas.ID_MEMBER" required></v-select>

                <v-select label="ID KELAS" :items="KelasController" item-text="NAMA_KELAS" item-value="ID_KELAS"
                    v-model="formDepositeKelas.ID_KELAS" required></v-select>

                <v-text-field label="Jumlah Kelas" required @input="checkPromo()" type="integer"
                    v-model="formDepositeKelas.JUMLAH_DEPOSIT_KELAS"></v-text-field>

                <v-text-field label="Bonus" v-model="formDepositeKelas.BONUS_DEPOSIT_Kelas" required disabled></v-text-field>
                <v-text-field label="Total" v-model="formDepositeKelas.TOTAL_DEPOSIT" required disabled></v-text-field>
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
                    Anda Yakin Ingin Melakukan Deposite Kelas?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="DepositeKelasProcces()">
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
                <v-btn class="ma-2" color="primary" dark to="DepositeKelas/print"> Print PDF
                </v-btn>
            </div>
        </template>

    </div>
</template>



<script>
import axios from 'axios'
// import router from '@/router'
import { ref, onMounted } from 'vue';
import toastr from 'toastr';
export default {
    name: "AdminCreateInstruktur",
    data: () => ({
        VerifDialog: false,
        formDepositeKelas: {
            HARGA_KELAS: "",
            ID_KELAS: "",
            ID_MEMBER: "",
            ID_PEGAWAI: "",
            PEG_ID_USER: "",
            MEM_ID_USER: "",
            ID_PROMO: "",
            JUMLAH_DEPOSIT_KELAS: "",
            BONUS_PROMO: "",
            TOTAL_DEPOSIT: "",
            TANGGAL_DEPOSIT_Kelas: new Date(),

        },
        document,
        window,
    }
    ),
    methods: {
        checkPromo() {
            let LocalPromo = this.updatePromo();
            try {
                this.formDepositeKelas.ID_PROMO = LocalPromo.ID_PROMO;
                this.formDepositeKelas.BONUS_DEPOSIT_Kelas = LocalPromo.BONUS_PROMO;
                this.formDepositeKelas.TOTAL_DEPOSIT = parseInt(this.formDepositeKelas.JUMLAH_DEPOSIT_KELAS) + parseInt(LocalPromo.BONUS_PROMO)
            } catch {
                this.formDepositeKelas.ID_PROMO = null;
                this.formDepositeKelas.BONUS_DEPOSIT_Kelas = 0;
                this.formDepositeKelas.TOTAL_DEPOSIT = this.formDepositeKelas.JUMLAH_DEPOSIT_KELAS;
            }
        },

        updatePromo() {
            let data = this.PromoController
            let pm = null
            data = data.filter((dt) => dt.JENIS_PROMO == 1);
            data.forEach((value) => {
                if (value.MINIMAL_DEPOSIT_PROMO <= this.formDepositeKelas.JUMLAH_DEPOSIT_KELAS && (pm === null || value.MINIMAL_DEPOSIT_PROMO > pm.MINIMAL_DEPOSIT_PROMO)) {
                    pm = value;
                    // console.log(pm.MINIMAL_DEPOSIT_PROMO, pm.NAMA_PROMO)
                }
            })
            return pm;
        },

        
        clearForm() {
            this.formDepositeKelas.ID_MEMBER = "",
            this.formDepositeKelas.JUMLAH_DEPOSIT_KELAS = ""
            this.formDepositeKelas.BONUS_DEPOSIT_Kelas = "";
            this.formDepositeKelas.ID_PROMO = "";
            this.formDepositeKelas.TOTAL_DEPOSIT = "";
        },

        openVerifDialog() {
            this.VerifDialog = true;
        },
        closeVerifDialog() {
            this.VerifDialog = false;
            this.deleteTarget = {};
        },


        DepositeKelasProcces() {
            const regexNominalKelas = /^[0-9]+$/;
            if (this.formDepositeKelas.ID_MEMBER == "") {
                toastr.error('Harap Masukkan Member')
                return;
            }
            if (this.formDepositeKelas.JUMLAH_DEPOSIT_KELAS == "") {
                toastr.error('Harap Masukkan Nominal Deposit')
                return;
            }
            if (!regexNominalKelas.test(this.formDepositeKelas.JUMLAH_DEPOSIT_KELAS)) {
                toastr.error('Jumlah Deposit Anda tidak Sesuai');
                return;
            }

            // const currentDate = new Date();
            // currentDate.setDate(currentDate.getDate() + 30);
            // const isoString = currentDate.toISOString()
            // console.log(isoString)

            let SelectedMember = this.MemberController.filter(i => i.ID_MEMBER == this.formDepositeKelas.ID_MEMBER);
            let dataUser = JSON.parse(sessionStorage.getItem("users"));
            this.formDepositeKelas.ID_MEMBER = SelectedMember[0].ID_MEMBER;
            this.formDepositeKelas.MEM_ID_USER = SelectedMember[0].ID_USER;
            this.formDepositeKelas.ID_PEGAWAI = dataUser.ID_PEGAWAI;
            this.formDepositeKelas.PEG_ID_USER = dataUser.ID_USER;

            axios.post('http://localhost:8000/api/depositeKelas/store', this.formDepositeKelas)
                .then(() => {
                    toastr.success('You have successfully registered, Thanks You')
                    // router.push('/Kasir/deposit')
                    this.VerifDialog = false;
                    this.formDepositeKelas.ID_MEMBER = "";
                    this.formDepositeKelas.BONUS_DEPOSIT_Kelas = "";
                    this.formDepositeKelas.JUMLAH_DEPOSIT_KELAS = "";
                    this.formDepositeKelas.ID_PROMO = "";
                    this.formDepositeKelas.TOTAL_DEPOSIT = "";
                    
                }).catch(error => {
                    toastr.error('Deposit Failed')
                    console.log(error);
                })

        },
    },

    setup() {
        let MemberController = ref([]);
        let UserController = ref([]);
        let PegawaiController = ref([]);
        let PromoController = ref([]);
        let KelasController = ref([]);

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
            axios.get('http://localhost:8000/api/kelas')
                .then(response => {
                    KelasController.value = response.data.data
                })
            // console.log(sessionStorage.getItem('users'))
        })


        return {
            MemberController,
            UserController,
            PegawaiController,
            PromoController,
            KelasController
        }
    },
};
</script>
