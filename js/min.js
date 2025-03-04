//button top scroll

window.onload = function () {
  let btnTop = document.getElementById('btn');

    window.onscroll = function () {
        if (window.scrollY >= 500) {
            btnTop.style.display = 'block';
        } else {
            btnTop.style.display = 'none';
            
        }
    }


    btnTop.onclick = function () {
        scroll({
            top: 0,
            behavior: 'smooth'});
    }

}

