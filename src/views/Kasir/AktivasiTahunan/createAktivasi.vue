<template>
    <div class="pa-5">
        <v-card class="pa-3">
            <v-form>
                <v-select label="ID Member" :items="MemberController" item-text="NAMA_USER" item-value="ID_MEMBER"
                    v-model="formAktivasi.ID_MEMBER" required></v-select>
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
                    Anda Yakin Ingin Melakukan Aktivasi?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="AktivasiProcess()">
                        Yes
                    </v-btn>
                    <v-btn color="green darken-1" text @click="closeVerifDialog()">
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>



<script>
import axios from 'axios'
import router from '@/router'
import { ref, onMounted } from 'vue';
import toastr from 'toastr';
export default {
    name: "AdminCreateInstruktur",
    data: () => ({
        VerifDialog: false,
        formAktivasi: {
            ID_MEMBER: "",
            ID_PEGAWAI: "",
            PEG_ID_USER: "",
            MEM_ID_USER: "",
        },
        document,
        window,
    }
    ),
    methods: {

        clearForm() {
            this.formAktivasi.ID_MEMBER = ""
        },

        openVerifDialog() {
            this.VerifDialog = true;
        },
        closeVerifDialog() {
            this.VerifDialog = false;
            this.deleteTarget = {};
        },


        AktivasiProcess() {
            if (this.formAktivasi.ID_MEMBER == "") {
                toastr.error('Harap Masukkan Member')
                return;
            }

            let SelectedMember = this.MemberController.filter(i => i.ID_MEMBER == this.formAktivasi.ID_MEMBER);
            let dataUser = JSON.parse(sessionStorage.getItem("users"));
            this.formAktivasi.ID_MEMBER = SelectedMember[0].ID_MEMBER;
            this.formAktivasi.MEM_ID_USER = SelectedMember[0].ID_USER;
            this.formAktivasi.ID_PEGAWAI = dataUser.ID_PEGAWAI;
            this.formAktivasi.PEG_ID_USER = dataUser.ID_USER;

            axios.post('http://localhost:8000/api/aktivasi/create', this.formAktivasi)
                .then(() => {
                    toastr.success('Registrasi Aktivasi Berhasil')
                    router.push('/Kasir/AktivasiTahunan')
                    this.VerifDialog = false;
                    // this.cetakStrukDepositUang();
                    this.formAktivasi.ID_MEMBER = "";
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
            // console.log(sessionStorage.getItem('users'))
        })


        return {
            MemberController,
            UserController,
            PegawaiController,
        }
    },
};
</script>
