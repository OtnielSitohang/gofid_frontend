<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="ma-12">
        <v-row>
            <v-col>
                <h1 class="mb-6">
                    Pegawai 
                    <span class="blue--text">GO</span><span class="red--text">FID</span>
                </h1>
            </v-col>
            <v-col align="right">
				<v-btn class="ma-2" color="primary"><v-icon>mdi-plus</v-icon></v-btn>
			</v-col>
        </v-row>
        <v-data-table 
            :headers="headers" 
            :items="PegawaiController"
        >
        <template v-slot:item.JABATAN_PEGAWAI="{ item }">
            {{ item.JABATAN_PEGAWAI == 0 ? 'Admin' : (item.JABATAN_PEGAWAI == 1 ? 'Kasir' : 'Manager Operasional') }}
        </template>
        <template v-slot:item.IS_DELETED_PEGAWAI="{ item }">
            {{ item.IS_DELETED_PEGAWAI == 1 ? 'Aktif' : 'Tidak Aktif' }}
        </template>
            <template v-slot:item.actions="{ item }">
                <v-btn small class="mr-2" @click="editItem(item)">
                  <v-icon dark>mdi-pencil</v-icon>
                </v-btn>
                <v-btn small @click="openDeleteDialog(item)">
                    <v-icon dark>mdi-delete</v-icon>
                </v-btn>
              </template>
        </v-data-table>
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
    </div>
</template>

<script>
import router from "@/router";
import { ref, onMounted } from 'vue';
import axios from 'axios'
// import { response } from "express";
// import toastr from 'toastr';

export default {
    name: "PegawaiReadComponent",
    data() {
        return {
            router,
            window,
            deleteDialog: false,
            headers: [
                { text: "ID_Pegawai", value: "ID_PEGAWAI" },
                { text: "JABATAN", value: "JABATAN_PEGAWAI" },
                { text: "STATUS", value: "IS_DELETED_PEGAWAI" },
                // { text: "EMAIL", value: "EMAIL" },
                // { text: "ALAMAT", value: "ALAMAT" },
                { text: "Actions", value: "actions", sortable: false  },
            ],
        };
    },

    methods: {
        openDeleteDialog(item) {
            this.deleteDialog = true;
            this.deleteTarget = item;
        },
        closeDeleteDialog() {
            this.deleteDialog = false;
            this.deleteTarget = {};
        },

        deleteProcess(){
            axios.delete('http://localhost:8000/api/pegawai',)
            .then(response =>{
                this.users = response.data.data;
                // toastr.success('User deleted successfully');
            })
            // .catch(error => {
            //     toastr.error('User deletion failed');
            // });
            this.closeDeleteDialog();
        }

    },
    setup(){
        let PegawaiController = ref([]);
        onMounted(() => {
            axios.get('http://localhost:8000/api/pegawai')
            .then(response =>{
                PegawaiController.value = response.data.data
            }).catch(error =>{
                console.log(error.response.data)
            })
        })
        return {
            PegawaiController
        }

    }
}
</script>