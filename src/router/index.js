import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Login',
        component: () =>
            import ("../views/LoginPage.vue"),
    },
    {
        path: '/Admin',
        name: 'admin',
        // meta: { title: "Dashboard" },
        component: () =>
            import ("../views/Admin/AdminLayout.vue"),
        children: [{
                path: "/Admin/Pegawai/",
                name: "Pegawai",
                meta: { title: "Pegawai" },
                component: () =>
                    import ("../views/Admin/Pegawai/ReadPegawai.vue"),
            },
            // {
            //     path: "/Admin/Pegawai/Create",
            //     name: "PegawaiCreate",
            //     meta: { title: "Pegawai" },
            //     component: () =>
            //         import ("../views/Kasir/Member/CreatePegawai.vue"),
            // },


            {
                path: "/Admin/Instruktur",
                name: "Instruktur",
                meta: { title: "Instruktur" },
                component: () =>
                    import ("../views/Admin/Instruktur/ReadAndDeleteInstruktur.vue"),
            },
            {
                path: "/Admin/Instruktur/Create",
                name: "InstrukturCreate",
                meta: { title: "InstrukturCreate" },
                component: () =>
                    import ("../views/Admin/Instruktur/CreateInstruktur.vue"),
            },
            // {
            //     path: "/Admin/Instruktur/Update/:ID_USER",
            //     name: "InstrukturUpdate",
            //     meta: { title: "InstrukturUpdate" },
            //     component: () =>
            //         import ("../views/Admin/Instruktur/UpdateInstruktur.vue")
            // }


        ],

    },
    {

        path: '/Kasir',
        name: 'Kasir',
        // meta: { title: "Dashboard" },
        component: () =>
            import ("../views/Kasir/KasirLayout.vue"),
        children: [{
                path: "/Kasir/Member",
                name: "Member",
                meta: { title: "Member" },
                component: () =>
                    import ("../views/Kasir/Member/ReadMember.vue"),
            },
            {
                path: "/Kasir/Member/Create",
                name: "Create",
                meta: { title: "MembeCreate" },
                component: () =>
                    import ("../views/Kasir/Member/CreateMember.vue"),
            },

        ],
    },

    {
        path: '/Manager',
        name: 'Manager',
        // meta: { title: "Dashboard" },
        component: () =>
            import ("../views/Manager/ManagerLayout.vue"),
        children: [{
                path: "/Manager/JadwalDefault",
                name: "JadwalDefault",
                meta: { title: "JadwalDefault" },
                component: () =>
                    import ("../views/Manager/JadwalDefault/ReadDeleteAndEditJadwal.vue"),
            },
            {
                path: "/Manager/JadwalDefault/Create",
                name: "Create",
                meta: { title: "JadwalDefaultCreate" },
                component: () =>
                    import ("../views/Manager/JadwalDefault/CreateJadwalDefault.vue"),
            },

        ],

    }
]

const router = new VueRouter({
    routes
})

export default router