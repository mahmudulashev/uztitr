
const hamMenu = document.querySelector('.ham-menu');
const offScreen = document.querySelector('.off-screen-menu');
const posterColumns = document.querySelectorAll('.poster-column'); // Posterlar ustunlari


hamMenu.addEventListener('click', () => {
    hamMenu.classList.toggle('active');     
    offScreen.classList.toggle('active');

    // Posterlarni yashirish yoki ko'rsatish
    posterColumns.forEach(column => {
        if (offScreen.classList.contains('active')) {
            column.style.visibility = 'hidden'; // Posterlarni yashirish
            column.style.zIndex = '-1'; // Posterlarni menyudan orqaga o'tkazish
        } else {
            column.style.visibility = 'visible'; // Posterlarni qayta ko'rsatish
            column.style.zIndex = '0'; // Posterlarni asl holatiga qaytarish
        }
    });
});