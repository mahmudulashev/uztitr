
const hamMenu = document.querySelector('.ham-menu');
const offScreen = document.querySelector('.off-screen-menu');
const posterColumns = document.querySelectorAll('.poster-column'); 


hamMenu.addEventListener('click', () => {
    hamMenu.classList.toggle('active');     
    offScreen.classList.toggle('active');

    
    posterColumns.forEach(column => {
        if (offScreen.classList.contains('active')) {
            column.style.visibility = 'hidden'; 
            column.style.zIndex = '-1'; 
        } else {
            column.style.visibility = 'visible'; 
            column.style.zIndex = '0'; 
        }
    });
});