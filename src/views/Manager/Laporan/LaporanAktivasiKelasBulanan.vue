<template>
    <v-app>
      <v-content>
        <v-container fluid>
          <v-row justify="center" align="center">
            <v-col cols="12" class="text-center">
              <h2 class="mb-4">Laporan Aktivasi Kelas Bulanan</h2>
            </v-col>
            <v-col cols="12" class="text-center">
              <v-select v-model="selectedMonth" :items="monthOptions" label="Bulan" dense></v-select>
              <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
              <template v-if="showLoading">
                <div v-if="isEmpty">Data masih kosong</div>
              </template>
              <template v-else>
                <v-data-table :items="filteredLaporan" :headers="headers" dense>
                  <template v-slot:item.TANGGAL_JADWAL_HARIAN="{ item }">
                    {{ formatDate(item.TANGGAL_JADWAL_HARIAN) }}
                  </template>
                  <template v-slot:item.HARI_JADWAL_HARIAN="{ item }">
                    {{ formatHari(item.HARI_JADWAL_HARIAN) }}
                  </template>
                  <template v-slot:item.SESI_JADWAL="{ item }">
                    {{ formatSesi(item.SESI_JADWAL) }}
                  </template>
                  <template v-slot:item.STATUS="{ item }">
                    {{ formatStatus(item.STATUS) }}
                  </template>
                </v-data-table>
              </template>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </v-app>
  </template>
  
  <script>
  import { ref, onMounted, computed, watch } from 'vue';
  import axios from 'axios';
  
  export default {
    setup() {
      const laporan = ref([]);
      const isLoading = ref(true);
      const isEmpty = ref(false);
      const showLoading = ref(false);
      const selectedMonth = ref(''); // Selected month filter
  
      const headers = [
        { text: 'ID Kelas', value: 'ID_KELAS' },
        { text: 'Nama Kelas', value: 'NAMA_KELAS' },
        { text: 'Nama Instruktur', value: 'NAMA_USER' },
        { text: 'Sesi Jadwal', value: 'SESI_JADWAL' },
        { text: 'Tanggal Jadwal Harian', value: 'TANGGAL_JADWAL_HARIAN' },
        { text: 'Hari Kelas', value: 'HARI_JADWAL_HARIAN' },
        { text: 'Status', value: 'STATUS' },
      ];
  
      const fetchData = async (month) => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/LaporanAktivasiKelasBulanan/${month}`);
          laporan.value = response.data;
          isEmpty.value = response.data.length === 0;
          console.log(response.data.length); // Check if data is empty
        } catch (error) {
          console.error(error);
        } finally {
          isLoading.value = false;
          if (isEmpty.value) {
            showLoading.value = true;
            setTimeout(() => {
              showLoading.value = false;
            }, 3000);
          }
        }
      };
  
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      };
  
      const formatHari = (hari) => {
        const hariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return hariList[hari];
      };
  
      const formatSesi = (sesi) => {
        const sesiList = ['06:00 - 08:00', '08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00', '18:00 - 20:00', '20:00 - 22:00'];
        return sesiList[sesi];
      };
  
      const formatStatus = (status) => {
        return status === 0 ? 'Berjalan' : 'Digantikan';
      };
  
      onMounted(() => {
        const currentDate = new Date();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Get current month with leading zero
        selectedMonth.value = currentMonth; // Set selectedMonth to current month
        fetchData(currentMonth);
      });
  
      watch(selectedMonth, (newMonth) => {
        laporan.value = [];
        isLoading.value = true;
        fetchData(newMonth);
      });
  
      const monthOptions = [
        { text: 'January', value: '01' },
        { text: 'February', value: '02' },
        { text: 'March', value: '03' },
        { text: 'April', value: '04' },
        { text: 'May', value: '05' },
        { text: 'June', value: '06' },
        { text: 'July', value: '07' },
        { text: 'August', value: '08' },
        { text: 'September', value: '09' },
        { text: 'October', value: '10' },
        { text: 'November', value: '11' },
        { text: 'December', value: '12' },
      ];
  
      // Filter laporan based on selected month
      const filteredLaporan = computed(() => {
        if (selectedMonth.value === '') {
          return laporan.value; // Return all data if no month selected
        } else {
          return laporan.value.filter((item) => {
            const month = item.TANGGAL_JADWAL_HARIAN.split('-')[1];
            return month === selectedMonth.value;
          });
        }
      });
  
      return {
        laporan,
        isLoading,
        isEmpty,
        showLoading,
        headers,
        formatDate,
        formatHari,
        formatSesi,
        formatStatus,
        selectedMonth,
        monthOptions,
        filteredLaporan,
      };
    },
  };
  </script>
  
  
  <style>
  /* Center the content vertically */
  .v-content {
    display: flex;
    justify-content: center;
    height: 100vh;
  }
  
  /* Style the table header */
  .v-data-table thead th {
    background-color: #f5f5f5;
    font-weight: bold;
    color: #333;
    border-bottom: 2px solid #ccc;
    padding: 12px;
  }
  
  /* Style the progress circular */
  .v-progress-circular {
    margin-bottom: 16px;
  }
  
  /* Style the "Data masih kosong" message */
  .empty-message {
    margin: 16px 0;
    font-weight: bold;
    color: #888;
  }
  
  /* Style the v-select */
  .v-select {
    margin-bottom: 16px;
  }
  
  /* Style the table cells */
  .v-data-table td {
    white-space: nowrap;
    padding: 8px;
    border-bottom: 1px solid #f5f5f5;
  }
  
  /* Style the container */
  .v-container {
    max-width: 600px;
  }
  
  /* Style the table responsive for smaller screens */
  @media (max-width: 600px) {
    .v-data-table {
      overflow-x: auto;
    }
  }
  
  /* Hover effect on table rows */
  .v-data-table tr:hover {
    background-color: #f5f5f5;
  }
  
  /* Style the pagination buttons */
  .v-pagination .v-btn {
    min-width: auto;
    padding: 6px 12px;
    margin: 0 2px;
  }
  
  /* Style the pagination info */
  .v-pagination .v-pagination__info {
    font-size: 14px;
    color: #666;
  }
  
  /* Style the table header sort icon */
  .v-data-table .sortable th .v-icon {
    font-size: 16px;
    margin-left: 4px;
    vertical-align: middle;
  }
  
  /* Update the styling for a more appealing look */
  .v-content {
    background-color: #f2f2f2;
  }
  
  .v-data-table {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .v-data-table__wrapper {
    overflow-x: auto;
  }
  
  .v-data-table__wrapper table {
    width: 100%;
    min-width: 700px;
  }
  
  .v-data-table__wrapper table thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #fff;
  }
  
  .v-data-table__wrapper table tbody td {
    border-bottom-color: #eee;
  }
  
  .v-pagination {
    margin-top: 16px;
  }
  
  .v-pagination__item {
    border-radius: 4px;
    min-width: auto;
    padding: 4px 10px;
    margin: 0 2px;
    color: #666;
  }
  
  .v-pagination__item--active {
    background-color: #1976d2;
    color: #fff;
  }
  
  .v-pagination__item--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .v-pagination__navigation {
    font-size: 16px;
    color: #666;
  }
  
  .v-select {
    width: 200px;
  }
  </style>
  