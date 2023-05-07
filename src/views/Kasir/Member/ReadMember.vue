<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="ma-12">
        <v-row>
            <v-col>
                <h1 class="mb-6">
                    Member
                    <span class="blue--text">GO</span><span class="red--text">FID</span>
                </h1>
            </v-col>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
            <v-col align="right">
                <v-btn class="ma-2" color="primary" to="Member/Create"><v-icon>mdi-plus</v-icon></v-btn>
            </v-col>
        </v-row>
        <template>
            <v-data-table :headers="headers" :items="MemberController" :search="search">
                <template v-slot:item.FOTO_USER="{ item }">
                    <v-avatar>
                        <img :src="'data:image/jpeg;base64,' + item.FOTO_USER">
                    </v-avatar>
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-btn x-small class="mr-2" @click="openResetDialog(item)">
                        <v-icon>mdi-rotate-left</v-icon>
                    </v-btn>
                    <v-btn x-small class="mr-2" @click="openUpdateDialog(item)">
                        <v-icon dark>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn x-small @click="openDeleteDialog(item)">
                        <v-icon dark>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn x-small @click="displayMemberCard(item)">
                        <v-icon>mdi-printer</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </template>

        <!-- Dialog Delete -->
        <v-dialog v-model="deleteDialog" max-width="320" persistent>
            <v-card>
                <v-card-title class="text-h5">
                    Are you sure you want to delete this user?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="closeDeleteDialog()">
                        Cancel
                    </v-btn>
                    <v-btn color="green darken-1" text @click="deleteProcess()">
                        Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
                    <v-btn color="green darken-1" text @click="UpdateMemberProcess()">
                        Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog ResetPasswor -->
        <v-dialog v-model="ResetDialog" max-width="400" persistent>
            <v-card>
                <v-card-title class="text-h5">
                    Are you sure you want to Reset Password this user?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="ResetPasswordMemberProcess()">
                        Yes
                    </v-btn>
                    <v-btn color="green darken-1" text @click="CloseDialogReset()">
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog Member Card -->
        <v-dialog v-model="memberCardDialog" width="auto" persistent>
            <v-card>
                <div id="CardMember">
                </div>
                <v-card-action>
                    <v-btn color="green-darken-1" variant="text" @click="OpenCardWindow()">
                        <v-icon left>mdi-printer</v-icon> Print
                    </v-btn>
                    <v-btn color="green-darken-1" variant="text" @click="CloseCardWindow()">
                        <v-icon left>mdi-close</v-icon> Close
                    </v-btn>
                    <!-- </v-row> -->
                </v-card-action>
            </v-card>
        </v-dialog>


        <!-- Dialog Update -->
        <template>
            <v-form>
                <v-row justify="center">
                    <v-dialog v-model="UpdateDialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
                        <v-card>
                            <v-toolbar dark color="primary">
                                <v-btn icon dark @click="UpdateDialog = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                                <v-toolbar-title>Update Member {{ editData.NAMA_USER }}</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-toolbar-items>
                                    <v-btn variant="text" color="primary" @click="openVerifDialog()">
                                        Save
                                    </v-btn>
                                </v-toolbar-items>
                            </v-toolbar>
                            <br>
                            <br>
                            <br>
                            <br>
                            <v-row>
                                <v-col cols="12" sm="4" md="4" left>
                                    <v-file-input v-model="editData.FOTO_USER" style="display: none" id="imageInput"
                                        accept="image/*" @change="setPreviewImage">
                                    </v-file-input>
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
                                <v-col cols="12" md="5">
                                    <v-text-field v-model="editData.ID_USER" label="ID User" prepend-icon="mdi-key"
                                        disabled>
                                    </v-text-field>
                                    <v-text-field v-model="editData.NAMA_USER" label="Name" prepend-icon="mdi-account">
                                    </v-text-field>
                                    <v-text-field v-model="editData.EMAIL_USER" label="Email" prepend-icon="mdi-email">
                                    </v-text-field>
                                    <v-menu v-model="birthdatePicker" :close-on-content-click="false" :nudge-right="40"
                                        transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="editData.TANGGAL_LAHIR_USER" label="Birthdate"
                                                prepend-icon="mdi-calendar" readonly v-bind="attrs"
                                                v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="editData.TANGGAL_LAHIR_USER"
                                            @input="birthdatePicker = false"></v-date-picker>
                                    </v-menu>
                                    <v-text-field v-model="editData.ALAMAT_MEMBER" label="Alamat" prepend-icon="mdi-home">
                                    </v-text-field>
                                    <v-text-field v-model="editData.TELEPON_MEMBER" label="Telephone"
                                        prepend-icon="mdi-book">
                                    </v-text-field>
                                    <v-text-field v-model="editData.SISA_DEPOSIT_MEMBER" label="Deposite"
                                        prepend-icon="mdi-cash">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-dialog>
                </v-row>
            </v-form>
        </template>
    </div>
</template>

<script>
import router from "@/router";
import { ref, onMounted } from 'vue';
import axios from 'axios'
// import { response } from "express";
import toastr from 'toastr';

export default {
    name: "InstrukturReadComponent",
    data() {
        return {
            router,
            window,
            deleteDialog: false,
            memberCardOpenedCanvas: null,
            UpdateDialog: false,
            VerifDialog: false,
            birthdatePicker: false,
            memberCardDialog: false,
            ResetDialog: false,
            search: '',
            headers: [
                { text: "ID", value: "ID_MEMBER" },
                { text: "Nama", value: "NAMA_USER" },
                { text: "Foto", value: "FOTO_USER" },
                { text: "Email", value: "EMAIL_USER" },
                { text: "Alamat", value: "ALAMAT_MEMBER" },
                { text: "Telephone", value: "TELEPON_MEMBER" },
                { text: "Deposite", value: "SISA_DEPOSIT_MEMBER" },
                { text: "Actions", value: "actions", sortable: false },
            ],
            editData: {
                ID_USER: null,
                NAMA_USER: null,
                FOTO_USER: null,
                EMAIL_USER: null,
                TANGGAL_LAHIR_USER: null,
                ALAMAT_MEMBER: null,
                TELEPON_MEMBER: null,
                SISA_DEPOSIT_MEMBER: 0,
            },
        };
    },

    methods: {
        openVerifDialog() {
            this.VerifDialog = true;
        },
        closeVerifDialog() {
            this.VerifDialog = false;
            this.UpdateDialog = false;
            this.deleteTarget = {};
        },

        OpenCardWindow() {
            var memberCardPrintWindow = window.open('', 'PRINT', 'height=272,width=430')
            memberCardPrintWindow.document.write('<img src="' + this.memberCardOpenedCanvas.toDataURL() + '">')
            memberCardPrintWindow.print()
            memberCardPrintWindow.close()
        },

        CloseCardWindow() {
            this.memberCardDialog = false;
            window.location.reload();
        },
        openDeleteDialog(item) {
            this.deleteDialog = true;
            this.deleteTarget = item;
        },
        closeDeleteDialog() {
            this.deleteDialog = false;
            this.deleteTarget = {};
        },
        deleteProcess() {
            axios.delete('http://localhost:8000/api/member/destroy/' + this.deleteTarget.ID_USER)
                .then(response => {
                    this.users = response.data.data;
                    toastr.success('User deleted successfully');
                    window.location.reload();
                })
                .catch(error => {
                    console.log(error);
                    toastr.error('User deletion failed');
                });
            this.closeDeleteDialog();
        },
        setPreviewImage() {
            const [file] = document.querySelector("#imageInput").files;
            if (file) {
                document.querySelector("#imagePreview").src =
                    URL.createObjectURL(file);
            }
        },

        openUpdateDialog(item) {
            this.UpdateDialog = true;
            this.editData.ID_USER = item.ID_USER
            this.editData.NAMA_USER = item.NAMA_USER
            this.editData.FOTO_USER = item.FOTO_USER
            this.editData.EMAIL_USER = item.EMAIL_USER
            this.editData.ALAMAT_MEMBER = item.ALAMAT_MEMBER
            this.editData.TELEPON_MEMBER = item.TELEPON_MEMBER
            this.editData.TANGGAL_LAHIR_USER = item.TANGGAL_LAHIR_USER
            this.editData.SISA_DEPOSIT_MEMBER = item.SISA_DEPOSIT_MEMBER
            this.updateTarget = item;
        },

        openResetDialog(item) {
            this.ResetDialog = true;
            this.editData.PASSWORD_USER = item.TANGGAL_LAHIR_USER
            this.editData.ID_USER = item.ID_USER
            this.editData.NAMA_USER = item.NAMA_USER
            this.editData.FOTO_USER = item.FOTO_USER
            this.editData.EMAIL_USER = item.EMAIL_USER
            this.editData.ALAMAT_MEMBER = item.ALAMAT_MEMBER
            this.editData.TELEPON_MEMBER = item.TELEPON_MEMBER
            this.editData.TANGGAL_LAHIR_USER = item.TANGGAL_LAHIR_USER
            this.editData.SISA_DEPOSIT_MEMBER = item.SISA_DEPOSIT_MEMBER
            this.updateTarget = item;
        },
        CloseDialogReset() {
            this.ResetDialog = false;
            this.ResetDialog = {};
        },

        UpdateMemberProcess() {
            const regexPhone = /^[0-9]+$/;
            const regexEmail = /^\S+@\S+\.\S+$/;


            //Nama User
            if (this.editData.NAMA_USER == "") {
                toastr.error('Please fill in the Name!')
                return;
            }

            //Email User
            if (this.editData.EMAIL_USER == "") {
                toastr.error('Please fill in the email!')
                return;
            } else if (!regexEmail.test(this.editData.EMAIL_USER)) {
                toastr.error('Please enter a valid email address for EMAIL_MEMBER!')
                return;
            }

            //Tanggal Lahir User
            if (this.editData.TANGGAL_LAHIR_USER == "") {
                toastr.error('Please fill in the birthdate!')
                return;
            }else if(new Date(this.editData.TANGGAL_LAHIR_USER) > new Date()){
                toastr.error('Anda Belum Lahir')
                return;
            }

            //Alamat User
            if (this.editData.ALAMAT_MEMBER == "") {
                toastr.error('Please fill in the Alamat!')
                return;
            }

            //Telephone User
            if (this.editData.TELEPON_MEMBER == "") {
                toastr.error('Please fill in the TELEPON_MEMBER!')
                return;
            } else if (!regexPhone.test(this.editData.TELEPON_MEMBER)) {
                toastr.error('The TELEPON_MEMBER should only contain digits!');
                return;
            }
           

            axios.put('http://localhost:8000/api/member/update/' + this.editData.ID_USER, { ...this.editData }
            )
                .then(() => {
                    toastr.success('You have successfully Update, Thanks You')
                    this.UpdateDialog = false;
                    window.location.reload();
                    console.log(this.formUser)
                }
                ).catch(error => {
                    toastr.error('Update failed!')
                    console.log(error);

                }
                )

        },
        ResetPasswordMemberProcess() {
            axios.put('http://localhost:8000/api/updatePassword/' + this.editData.ID_USER, { ...this.editData })
                // console.log(this.editData)
                .then(() => {
                    toastr.success('You have successfully Update, Thanks You')
                    this.ResetDialog = false;
                    window.location.reload();
                }).catch(error => {
                    toastr.error('Update failed!')
                    console.log(error);
                })
        },
    },

    setup() {
        let MemberController = ref([]);
        // let displayMemberCard = ref([]);
        onMounted(() => {
            axios.get('http://localhost:8000/api/member')
                .then(response => {
                    MemberController.value = response.data.data
                    // console.log(MemberController.value[0].ID_MEMBER)
                }).catch(error => {
                    console.log(error.response.data)
                })
        })



        function displayMemberCard(member) {
            this.memberCardDialog = true
            // memberCardOpenedMemberID.value = member.ID_MEMBER
            var background = new Image()
            // background.src = 'src/assets/Gofid.jpg'
            setTimeout(() => {
                var canvas = document.createElement('canvas')
                //Ukuran Canvas
                canvas.width = 500
                canvas.height = 250
                document.getElementById('CardMember').appendChild(canvas)
                var ctx = canvas.getContext('2d')
                ctx.globalCompositeOperation = 'darken'
                ctx.drawImage(background, 0, 0)
                //Set Huruf dan Font

                //Tittle
                ctx.font = '20px Futura'
                ctx.fillText('GOFID CARD MEMBER ', 150, 30)

                ctx.font = '50px Futura'
                ctx.fillText((member.NAMA_USER.length > 15 ? member.NAMA_USER.substring(0, 18) + '...' : member.NAMA_USER), 25, 120)
                ctx.font = '18px Courier New'
                ctx.fillText('MEMBER ID: ' + member.ID_MEMBER, 25, 180)
                ctx.fillText('ADDRESS  : ' + (member.ALAMAT_MEMBER.length > 23 ? member.ALAMAT_MEMBER.substring(0, 21) + '...' : member.ALAMAT_MEMBER), 25, 200)
                ctx.fillText('PHONE    : ' + member.TELEPON_MEMBER, 25, 220)
                // memberCardDialogSpinnerState.value = false
                this.memberCardOpenedCanvas = canvas
            }, 3000)
        }
        return {
            MemberController,
            displayMemberCard
        }
    }
}
</script>