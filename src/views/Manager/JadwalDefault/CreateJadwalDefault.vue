<template>
    <div class="ma-12">
        <v-form>
            <v-row>
                <v-col>
                    <h1 class="mb-6">Create Jadwal</h1>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select label="Kelas"
                        :items="NamaKelas" item-text="NAMA_KELAS" item-value="ID_KELAS" v-model="formUser.ID_KELAS">
                    </v-select>

                    <v-select label="SESI JADWAL" v-model="formUser.SESI_JADWAL"
                        :items="SESI_JADWAL">
                    </v-select>

                    <v-select label="HARI" v-model="formUser.HARI_JADWAL_DEFAULT"
                        :items="HARI_JADWAL_DEFAULT">
                    </v-select>
                    
                    <v-select label="Instruktur" v-model="formUser.ID_INSTRUKTUR"
                        :items="NamaInstrutur" item-text="NAMA_USER" item-value="ID_INSTRUKTUR">
                    </v-select>

                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <div class="text-right">
                        <v-btn color="primary" @click="createUserProcess">Save</v-btn>
                        <v-btn color="error" class="ml-4" @click="window.history.back()">Cancel</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-form>
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
        showPassword: false,
        document,
        window,
        formUser: {
            ID_KELAS: "",
            ID_USER: "",
            ID_INSTRUKTUR: "",
            SESI_JADWAL: "",
            HARI_JADWAL_DEFAULT: "",

        },
        SESI_JADWAL: [{
            text: '06:00 - 08:00', value: '0'
        }, {
            text: '08:00 - 10:00', value: '1'
        },{
            text: '10:00 - 12:00', value: '2'
        },{
            text: '12:00 - 14:00', value: '3'
        },{
            text: '14:00 - 16:00', value: '4'
        },{
            text: '18:00 - 20:00', value: '5'
        },{
            text: '20:00 - 22:00', value: '6'
        }],

        HARI_JADWAL_DEFAULT: [{
            text: 'Senin', value: '0'
        }, {
            text: 'Selasa', value: '1'
        },{
            text: 'Rabu', value: '2'
        },{
            text: 'Kamis', value: '3'
        },{
            text: 'Jumat', value: '4'
        },{
            text: 'Sabtu', value: '5'
        },{
            text: 'Minggu', value: '6'
        }],
    }),
    methods: {
        createUserProcess() {
            if (this.formUser.ID_KELAS == "") {
                toastr.error('Please fill in the Class!')
                // } else if (this.formUser.ID_USER == "") {
                // toastr.error('Please fill in the Instruktur!')
            } else if (this.formUser.ID_INSTRUKTUR == "") {
                toastr.error('Please fill in the Instruktur!')
            } else if (this.formUser.SESI_JADWAL == null) {
                toastr.error('Please fill in the Sesi!')
            } else if (this.formUser.HARI_JADWAL_DEFAULT == null) {
                toastr.error('Please fill in the Hari!')
            } else {
                let formData = new FormData()
                formData.append('ID_KELAS', this.formUser.ID_KELAS)
                formData.append('ID_USER', this.NamaInstrutur.filter(i => i.ID_INSTRUKTUR == this.formUser.ID_INSTRUKTUR)[0].ID_USER)
                formData.append('ID_INSTRUKTUR', this.formUser.ID_INSTRUKTUR)
                formData.append('SESI_JADWAL', this.formUser.SESI_JADWAL)
                formData.append('HARI_JADWAL_DEFAULT', this.formUser.HARI_JADWAL_DEFAULT)
                axios.post('http://localhost:8000/api/jadwal_default/create', formData,
                    {
                        headers: {
                            // Overwrite Axios's automatically set Content-Type
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(() => {
                        toastr.success('You have successfully Make Jadwal, Thanks You')
                        router.push('/Manager/JadwalDefault')
                    }
                    ).catch(error => {
                        toastr.error('Registration failed!')
                        console.log(error);

                    }
                    )
            }
        },
    },
    setup() {
        let jadwalDefaultController = ref([]);
        let NamaKelas = ref([]);
        let NamaInstrutur = ref([]);

        onMounted(() => {
            axios.get('http://localhost:8000/api/jadwal_default')
                .then(response => {
                    jadwalDefaultController.value = response.data.data
                }).catch(error => {
                    console.log(error.response.data)
                }),
            axios.get('http://localhost:8000/api/kelas')
            .then(response =>{
                NamaKelas.value = response.data.data
            })
            axios.get('http://localhost:8000/api/instruktur')
            .then(response =>{
                NamaInstrutur.value = response.data.data
            })
        })
        return {
            jadwalDefaultController,
            NamaKelas,
            NamaInstrutur
        }
    }
};
</script>
