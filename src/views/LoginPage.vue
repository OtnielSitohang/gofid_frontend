<template>
	<v-main>
		<v-app id="inspire">
			<span class="bg"></span>
			<v-content>
				<v-container fluid fill-height>
					<v-layout align-center justify-center>
						<v-flex xs12 sm8 md4>
							<v-card class="elevation-12">
								<v-toolbar dark color="blue">
									<v-toolbar-title>Login</v-toolbar-title>
								</v-toolbar>
								<v-card-text>
									<v-form>
										<v-text-field v-model="formUser.EMAIL_USER" prepend-icon="mdi-email" name="email"
											label="Email" type="text"></v-text-field>
										<v-text-field v-model="formUser.PASSWORD_USER" id="password" prepend-icon="mdi-lock"
											clearable name="password" label="Password" :append-icon="value
													? 'mdi-eye-off'
													: 'mdi-eye'
												" @click:append="value = !value" :type="value ? 'password' : 'text'
		"></v-text-field>
									</v-form>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn dark color="blue" @click="loginProcess">Login</v-btn>
								</v-card-actions>
							</v-card>
						</v-flex>
					</v-layout>
				</v-container>
			</v-content>
		</v-app>
	</v-main>
</template>

<script>
import axios from 'axios'
import router from '@/router'
import toastr from 'toastr'
export default {
	data() {
		return {
			value: String,
			formUser: {
				EMAIL_USER: "",
				PASSWORD_USER: ""
			}
		};
	},
	methods: {
		loginProcess() {
			if (this.formUser.EMAIL_USER == "") {
                toastr.error('Please fill in the email!')
				return;
            } 
			if (this.formUser.PASSWORD_USER == null) {
                toastr.error('Please fill in the Password')
				return;
            } 
				axios.post('http://localhost:8000/api/login', {
					EMAIL_USER: this.formUser.EMAIL_USER,
					PASSWORD_USER: this.formUser.PASSWORD_USER,
				})
					.then(response => {
						console.log(response)
						sessionStorage.setItem('users', JSON.stringify(response.data.data))
						if (response.data.data.ID_PEGAWAI != null) {
							if (response.data.data.JABATAN_PEGAWAI == "1") {
								router.push({ path: '/Admin/' })
								toastr.success('Anda Berhasil Login Sebagai Admin');
							} else if (response.data.data.JABATAN_PEGAWAI == "0") {
								router.push({ path: '/Kasir/' })
								toastr.success('Anda Berhasil Login Sebagai Kasir');
							} else if (response.data.data.JABATAN_PEGAWAI == "2") {
								router.push({ path: '/Manager/' })
								toastr.success('Anda Berhasil Login Sebagai Manager');
							} else {
								console.log('Data tidak ada');
								toastr.error('Login Gagal');
							}
							console.log(response.data.data);
						} else if (response.data.data.ID_INSTRUKTUR != null) {
							router.push({ path: '/Instruktur/' })
							toastr.success('Anda Berhasil Login Sebagai Instruktur');
						} else router.push({ path: '/Member/' })
					}).catch((error) => {
						console.error(error);
					})
			}
			
		

	},
};
</script>