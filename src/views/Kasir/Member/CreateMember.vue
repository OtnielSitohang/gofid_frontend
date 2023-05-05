<template>
    <div class="ma-12">
        <v-form>
            <v-row>
                <v-col>
                    <h1 class="mb-6">Create Member</h1>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="6" md="4">
                    <v-file-input v-model="formUser.user_photo" style="display: none" id="imageInput" accept="image/*"
                        @change="setPreviewImage"></v-file-input>
                    <div class="text-center">
                        <img src="../../../assets/account-circle.svg" @click="document.querySelector('#imageInput').click()
                            " id="imagePreview" style="
								border-radius: 50%;
								cursor: pointer;
								max-width: 256px;
								max-height: 256px;
								min-width: 256px;
								min-height: 256px;
								object-fit: cover;
							" />
                    </div>
                </v-col>
                <v-col>
                    <v-text-field v-model="formUser.NAMA_USER" label="Name" prepend-icon="mdi-account">
                    </v-text-field>
                    <v-text-field v-model="formUser.EMAIL_USER" label="Email" prepend-icon="mdi-email">
                    </v-text-field>
                    <v-menu v-model="birthdatePicker" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="formUser.TANGGAL_LAHIR_USER" label="Birthdate"
                                prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="formUser.TANGGAL_LAHIR_USER"
                            @input="birthdatePicker = false"></v-date-picker>
                    </v-menu>
                    <v-text-field v-model="formUser.ALAMAT_MEMBER" label="Alamat" prepend-icon="mdi-home">
                        <!-- :rules="[val => /^\d+$/.test(val) || 'Nomor Telp Harus Angka']" -->
                    </v-text-field>
                    <v-text-field v-model="formUser.TELEPON_MEMBER" label="Telephone" prepend-icon="mdi-phone">
                        <!-- :rules="[val => /^\d+$/.test(val) || 'Nomor Telp Harus Angka']" -->
                    </v-text-field>
                    <v-text-field v-model="formUser.SISA_DEPOSIT_MEMBER" label="Deposite" prepend-icon="mdi-cash">
                        <!-- :rules="[val => /^\d+$/.test(val) || 'Nomor Telp Harus Angka']" -->
                    </v-text-field>

                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <div class="text-right">
                        <!-- <v-btn color="primary" @click="openVerifDialog()">Save</v-btn> -->
                        <v-btn color="primary" @click="createUserProcess()">Save</v-btn>
                        <v-btn color="error" class="ml-4" @click="window.history.back()">Cancel</v-btn>
                    </div>
                </v-col>
            </v-row>

            <!-- PerifDialog -->
            <v-dialog v-model="VerifDialog" max-width="320" persistent>
                <v-card>
                    <v-card-title class="text-h5">
                        Are you sure you want to Update this user?
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="closeVerifDialog()">
                            Cancel
                        </v-btn>
                        <v-btn color="green darken-1" text @click="createUserProcess">
                            Yes
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-form>
    </div>
</template>
<script>
import axios from 'axios'
import router from '@/router'
import toastr from 'toastr';
export default {
    name: "AdminCreateInstruktur",
    data: () => ({
        showPassword: false,
        document,
        window,
        birthdatePicker: false,
        VerifDialog: false,
        formUser: {
            user_photo: null,
            NAMA_USER: "",
            TANGGAL_LAHIR_USER: "",
            EMAIL_USER: "",
            ALAMAT_MEMBER: "",
            TELEPON_MEMBER: "",
            SISA_DEPOSIT_MEMBER: 0,
        },
    }),
    methods: {
        setPreviewImage() {
            const [file] = document.querySelector("#imageInput").files;
            if (file) {
                document.querySelector("#imagePreview").src =
                    URL.createObjectURL(file);
            }
        },
        openVerifDialog() {
            this.VerifDialog = true;
        },
        closeVerifDialog() {
            this.VerifDialog = false;
            this.deleteTarget = {};
        },
        createUserProcess() {
            const regexPhone = /^[0-9]+$/;
            const regexEmail = /^\S+@\S+\.\S+$/;

            if (this.formUser.NAMA_USER == "") {
                toastr.error('Please fill in the name!')
                return;
            } 
            if (this.formUser.EMAIL_USER == "") {
                toastr.error('Please fill in the email!')
                return;
            } else if (!regexEmail.test(this.formUser.EMAIL_USER)){
                toastr.error('Please enter a valid email address for EMAIL_MEMBER!')
                return;
            }



            if (this.formUser.TANGGAL_LAHIR_USER == "") {
                toastr.error('Please fill in the birthdate!')
                return;
            } 
            if (this.formUser.ALAMAT_MEMBER == "") {
                toastr.error('Please fill in the ALAMAT_MEMBER!')
                return;
            } 
            if (this.formUser.user_photo == null) {
                toastr.error('Please fill in the photo!')
                return;
            }

            if (this.formUser.TELEPON_MEMBER == "") {
                toastr.error('Please fill in the TELEPON_MEMBER!')
                return;
            } else if(!regexPhone.test(this.formUser.TELEPON_MEMBER)){
                toastr.error('The TELEPON_MEMBER should only contain digits!');
                return;
            }

                let formData = new FormData()
                // formData.append('FOTO_USER ', this.formUser.user_photo)
                formData.append('FOTO_USER', "Not Available")
                formData.append('NAMA_USER', this.formUser.NAMA_USER)
                formData.append('TANGGAL_LAHIR_USER', this.formUser.TANGGAL_LAHIR_USER)
                formData.append('EMAIL_USER', this.formUser.EMAIL_USER)
                formData.append('ALAMAT_MEMBER', this.formUser.ALAMAT_MEMBER)
                formData.append('TELEPON_MEMBER', this.formUser.TELEPON_MEMBER)
                formData.append('SISA_DEPOSIT_MEMBER', this.formUser.SISA_DEPOSIT_MEMBER)
                axios.post('http://localhost:8000/api/member/create', formData,
                    {
                        headers: {
                            // Overwrite Axios's automatically set Content-Type
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(() => {
                        toastr.success('You have successfully registered, Thanks You')
                        router.push('/Kasir/Member')
                    }
                    ).catch(error => {
                        toastr.error('Registration failed!')
                        console.log(error);

                    }
                    )
            
            
        }
    },
};
</script>
