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


            //Deposite Uang
            {
                path: "/Kasir/deposit",
                name: "Deposite",
                meta: { title: "Deposite" },
                component: () =>
                    import ("../views/Kasir/Deposituang/DepositUang.vue"),
            },
            {
                path: "Deposite/print",
                name: "Cetak Struk",
                meta: { title: "Cetak Struck" },
                component: () =>
                    import ("../views/Kasir/Deposituang/cetakStruck.vue"),
            },


            //Deposite Kelas
            {
                path: "/kasir/DepositKelas",
                name: "Deposite",
                meta: { title: "Deposite" },
                component: () =>
                    import ("../views/Kasir/DepositKelas/DepositeKelas.vue"),
            },
            {
                path: "DepositeKelas/print",
                name: "Cetak Struk",
                meta: { title: "Cetak Struck" },
                component: () =>
                    import ("../views/Kasir/DepositKelas/CetakStruckKelas.vue"),
            },


            //Akativasi Tahunan
            {
                path: "/Kasir/AktivasiTahunan",
                name: "AktivasiTahunan",
                meta: { title: "AktivasiTahunan" },
                component: () =>
                    import ("../views/Kasir/AktivasiTahunan/AktivasiTahunan.vue"),
            },
            {
                path: "AktivasiTahunan/createAktivasi",
                name: "Aktavasi",
                meta: { title: "Aktavasi" },
                component: () =>
                    import ("../views/Kasir/AktivasiTahunan/createAktivasi.vue"),
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





            //Jadwal harian
            {
                path: "/Manager/JadwalHarian",
                name: "JadwalHarian",
                meta: { title: "JadwalHarian" },
                component: () =>
                    import ("../views/Manager/JadwalHarian/ReadDeleteAndEditJadwalHarian.vue"),
            },


        ],

    }
]

const router = new VueRouter({
    routes
})

export default router