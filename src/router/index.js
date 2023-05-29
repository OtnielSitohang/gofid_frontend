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
                name: "Create Member",
                meta: { title: "MembeCreate" },
                component: () =>
                    import ("../views/Kasir/Member/CreateMember.vue"),
            },


            //Deposite Uang
            {
                path: "/Kasir/deposit",
                name: "Deposite Uang",
                meta: { title: "Deposite" },
                component: () =>
                    import ("../views/Kasir/Deposituang/DepositUang.vue"),
            },
            {
                path: "Deposite/print",
                name: "Cetak Struk Deposite Uang",
                meta: { title: "Cetak Struck" },
                component: () =>
                    import ("../views/Kasir/Deposituang/cetakStruck.vue"),
            },


            //Deposite Kelas
            {
                path: "/kasir/DepositKelas",
                name: "Deposite Kelas",
                meta: { title: "Deposite" },
                component: () =>
                    import ("../views/Kasir/DepositKelas/DepositeKelas.vue"),
            },
            {
                path: "DepositeKelas/print",
                name: "Cetak Struk Deposite Kelas",
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

            //MendeaktifasiMember
            {
                path: "/Kasir/MendeaktifasiMember",
                name: "MendeaktifasiMember",
                meta: { title: "MendeaktifasiMember" },
                component: () =>
                    import ("../views/Kasir/Sistem/MendeaktifasiMember.vue"),
            },

            //DepositeKelasReset
            {
                path: "/Kasir/DepositePaket",
                name: "DepositeKelasReset",
                meta: { title: "DepositeKelasReset" },
                component: () =>
                    import ("../views/Kasir/Sistem/DepositePaketReset.vue"),
            },


            //Presensi Member Gym
            {
                path: "/Kasir/PresensiMemberGym",
                name: "PresensiMemberGym",
                meta: { title: "PresensiMemberGym" },
                component: () =>
                    import ("../views/Kasir/PresensiMemberGym/IndexPresensiGym.vue"),
            },
            //Presensi Kelas Reguler
            {
                path: "/Kasir/PresensiKelas",
                name: "PresensiKelas",
                meta: { title: "PresensiKelas" },
                component: () =>
                    import ("../views/Kasir/PresensiKelasPaketReguler/IndexPresensiKelas.vue"),
            },

            //Presensi Kelas Paket
            {
                path: "/Kasir/PresensiKelasPaket",
                name: "PresensiKelasPaket",
                meta: { title: "PresensiKelasPaket" },
                component: () =>
                    import ("../views/Kasir/PresensiKelasPaket/PresensiKelasPaketReguler.vue"),
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
                name: "Create Jadwal",
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

            //Izin Instruktur
            {
                path: "/Manager/Izin",
                name: "IzinInstruktur",
                meta: { title: "IzinInstruktur" },
                component: () =>
                    import ("../views/Manager/IjinInstruktur/ijinInstruktur.vue"),
            },

            //Laporan
            {
                path: "/Manager/LaporanAktivasiKelasBulanan",
                name: "LaporanAktivasiKelasBulanan",
                meta: { title: "LaporanAktivasiKelasBulanan" },
                component: () =>
                    import ("../views/Manager/Laporan/LaporanAktivasiKelasBulanan.vue"),
            },


        ],

    }
]

const router = new VueRouter({
    routes
})

export default router