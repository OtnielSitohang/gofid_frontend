<template>
	<v-app id="inspire">
		<v-app-bar app>
			<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
			<div>
				<v-icon class="pa-2">
					mdi-account
				</v-icon> Welcome to
				<span class="blue--text">GO</span><span class="red--text">FID</span>
				{{ JSON.parse(sessionStorage.getItem("users")).NAMA_USER }}
			</div>
			<v-menu offset-y>
				<template v-slot:activator="{ on }">
					<v-avatar color="grey darken-1 shrink" size="32" class="ml-auto" v-on="on" style="cursor: pointer">
						<img :src="'data:image/jpeg;base64,' + JSON.parse(sessionStorage.getItem('users')).FOTO_USER"
						style="height: 6cm; width: 6cm;">
					</v-avatar>
				</template>

				<v-list dense>
					<div class="text-center">
						<div class="mt-2">{{ JSON.parse(sessionStorage.getItem("users")).NAMA_USER }}</div>
						<v-chip class="mt-2 mb-2" color="orange lighten-4">Administrator</v-chip>
					</div>
					<hr />

					<v-list-item @click="ProfileOpen()">
						<v-list-item-icon>
							<v-icon>mdi-cog</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title>Profile</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
					<v-list-item @click="Logout()">
						<v-list-item-icon>
							<v-icon>mdi-logout</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title>Logout</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-app-bar>

		<v-main>
			<router-view></router-view>
		</v-main>

		<v-navigation-drawer v-model="drawer" app>
			<h1 class="pa-2">
				<v-row>
					<v-col>
						<center>
							<span class="blue--text">GO</span><span class="red--text">FID</span>
						</center>
					</v-col>
					<v-col>
						<v-img class="ml-left" max-height="38" max-width="38" src="../../assets/Gofid.jpg"></v-img>
					</v-col>
				</v-row>

			</h1>
			<v-list dense>
				<v-list-item v-for="(navigationDrawerItem, index) in navigationDrawerItems" tag="router-link"
					:to="navigationDrawerItem.to" :key="index">
					<v-list-item-icon class="pa-3">
						<v-icon>{{ navigationDrawerItem.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content class="pa-3">
						<v-list-item-title>{{
							navigationDrawerItem.text
						}}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-dialog v-model="settingsDialog" max-width="290" fullscreen>
			<v-card>
				<v-toolbar dark color="primary">
					<v-btn icon dark @click="settingsDialog = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
					<v-toolbar-title>Profile</v-toolbar-title>
					<v-spacer></v-spacer>
				</v-toolbar>
				<div class="ma-12">
					<v-form>
						<v-row>
								<v-col>
									<h1 class="mb-6">Welcome to Profile {{
										JSON.parse(sessionStorage.getItem("users")).NAMA_USER }}</h1>
								</v-col>
							</v-row>
							<v-row>
								<v-col class="text-center">
									<v-file-input style="display: none" id="currentUserPhoto" accept="image/*"
										@change="setCurrentUserPhotoPreview" disable></v-file-input>
										<div class="text-center">
											<img :src="'data:image/jpeg;base64,' + JSON.parse(sessionStorage.getItem('users')).FOTO_USER" @click="document
											.querySelector(
												'#currentUserPhoto'
												)
												.click()
												" id="currentUserPhotoPreview" style="
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
							</v-row>
						<v-row>
							<v-col>
								<div class="pa-3">
									<v-icon class="pa-2">
										mdi-account
									</v-icon>
									Nama : {{ JSON.parse(sessionStorage.getItem("users")).NAMA_USER }}
								</div>

								<div class="pa-3">
									<v-icon class="pa-2">
										mdi-account-multiple
									</v-icon>
									Jabatan : {{ JSON.parse(sessionStorage.getItem("users")).JABATAN_PEGAWAI == 0 ? 'Kasir'
										: (JSON.parse(sessionStorage.getItem("users")).JABATAN_PEGAWAI == 1 ? 'Admin' : 'Manager Operasional')}}
								</div>

								<div class="pa-3">
									<v-icon class="pa-2">
										mdi-email
									</v-icon>
									{{ JSON.parse(sessionStorage.getItem("users")).EMAIL_USER }}
								</div>
							</v-col>
						</v-row>
					</v-form>
				</div>
			</v-card>
		</v-dialog>



	</v-app>
</template>

<script>
import router from "@/router";
//   import axios from "axios";
//   import toastr from "toastr";
export default {
	data: () => ({
		router,
		sessionStorage,
		drawer: null,
		// currentUser: JSON.parse(window.atob(router.currentRoute.params.user)),
		settingsDialog: false,
		navigationDrawerItems: [
			// {
			// 	icon: "mdi-account",
			// 	text: "Pegawai",
			// 	to: "/Admin/Pegawai",
			// },
			{
				icon: "mdi-clock",
				text: "Jadwal Umum",
				to: "/Manager/JadwalDefault",
			},
			{
				icon: "mdi-cash-multiple",
				text: "Jadwal Harian",
				to: "/Manager/JadwalHarian",
			},
			// {
			// 	icon: "mdi-account-multiple",
			// 	text: "Member",
			// 	to: "..",
			// },
		],
	}),

	methods: {
		ProfileOpen() {
			this.settingsDialog = true;
		},
		Logout(){
			router.push({ path: '/' });
			// localStorage.removeItem("mytime"); 
			sessionStorage.removeItem('users')
		},
		setCurrentUserPhotoPreview() {
			const [file] = document.querySelector("#currentUserPhoto").files;
			if (file) {
				document.querySelector("#currentUserPhotoPreview").src =
					URL.createObjectURL(file);
			}
		},
	},


};
</script>