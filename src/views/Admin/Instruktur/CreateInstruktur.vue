<template>
    <div class="ma-12">
        <v-form>
            <v-row>
                <v-col>
                    <h1 class="mb-6">Create Instruktur</h1>
                </v-col>
            </v-row>
            <!-- <v-form > -->
            <v-row>
                <v-col cols="12" sm="6" md="4">
                    <!-- <input id="InputFoto" @input="HowToInputFotoUseBase64" type="file" accept="image/*">
                    <v-file-input id="InputFoto" @input="HowToInputFotoUseBase64" type="file" accept="image/*" v-model="formUser.FOTO_USER"></v-file-input> -->
                    <v-file-input v-model="formUser.FOTO_USER" style="display: none" id="imageInput" accept="image/*"
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
                                prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker v-model="formUser.TANGGAL_LAHIR_USER"
                            @input="birthdatePicker = false"></v-date-picker>
                    </v-menu>
                    <v-text-field v-model="formUser.DESKRIPSI_INSTRUKTUR" label="DESKRIPSI_INSTRUKTUR"
                        prepend-icon="mdi-book">
                    </v-text-field>

                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <div class="text-right">
                        <v-btn color="primary" @click="openVerifDialog()" >Save</v-btn>
                        <v-btn color="error" class="ml-4" @click="window.history.back()">Cancel</v-btn>
                    </div>
                </v-col>
            </v-row>
        <!-- </v-form> -->

            <!-- PerifDialog -->
        <v-dialog v-model="VerifDialog" max-width="320" persistent>
            <v-card>
                <v-card-title class="text-h5">
                    Are you sure you want to Create this Instruktur?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="createUserProcess()">
                        Yes
                    </v-btn>
                    <v-btn color="green darken-1" text   @click="closeVerifDialog()">
                        Cancel
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
        VerifDialog : false,
        formUser: {
            FOTO_USER: "",
            NAMA_USER: "",
            TANGGAL_LAHIR_USER: "",
            EMAIL_USER: "",
            DESKRIPSI_INSTRUKTUR: "",
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
        
        
        HowToInputFotoUseBase64() {
            var fileInput = document.getElementById('InputFoto')
            var file = fileInput.files[0]
            var reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = function (event) {
                var img = new Image()
                img.src = event.target.result
                img.onload = function () {
                    var canvas = document.createElement('canvas')
                    var ctx = canvas.getContext('2d')
                    var width = 256
                    var height = 256
                    var offsetX = 0
                    var offsetY = 0
                    if (img.width > img.height) {
                        height = Math.round(img.height * (width / img.width))
                        offsetY = Math.round((256 - height) / 2)
                    } else {
                        width = Math.round(img.width * (height / img.height))
                        offsetX = Math.round((256 - width) / 2)
                    }
                    canvas.width = 256
                    canvas.height = 256
                    ctx.fillStyle = '#ffffff'
                    ctx.fillRect(0, 0, 256, 256)
                    ctx.drawImage(img, offsetX, offsetY, width, height)
                    var base64 = canvas.toDataURL('image/jpeg')
                    this.formUser.FOTO_USER = base64.substring(23)
                }
            }
        },
        createUserProcess() {
            // const regexPhone = /^[0-9]+$/;
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
            }else if(new Date(this.formUser.TANGGAL_LAHIR_USER) > new Date()){
                toastr.error('Anda Belum Lahir')
                return;
            }
            // if (this.formUser.FOTO_USER == "") {
            //     toastr.error('Please fill in the photo!')
            //     return;
            // }  
            if (this.formUser.DESKRIPSI_INSTRUKTUR == "") {
                toastr.error('Please fill in the DESKRIPSI_INSTRUKTUR!')
                return;
            }  
                let formData = new FormData()
                // formData.append('FOTO_USER', this.formUser.FOTO_USER)
                formData.append('FOTO_USER', "Not Available")
                formData.append('NAMA_USER', this.formUser.NAMA_USER)
                formData.append('TANGGAL_LAHIR_USER', this.formUser.TANGGAL_LAHIR_USER)
                formData.append('EMAIL_USER', this.formUser.EMAIL_USER)
                formData.append('DESKRIPSI_INSTRUKTUR', this.formUser.DESKRIPSI_INSTRUKTUR)
                axios.post('http://localhost:8000/api/instruktur/create', formData,
                    {
                        headers: {
                            // Overwrite Axios's automatically set Content-Type
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(() => {
                        toastr.success('You have successfully registered, Thanks You')
                        router.push('/Admin/Instruktur')
                    }
                    ).catch(error => {
                        toastr.error('Registration failed!')
                        console.log(error);

                    }
                    )
            
        },
    },
};
</script>
