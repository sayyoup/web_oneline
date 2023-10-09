/**
 * registration_complete.js : 5초 카운트
 */

 document.addEventListener('DOMContentLoaded', function(){
    
    const formBack = document.querySelector('form#formBack')
    
    let timeleft = 1;
    let downloadTimer = setInterval(function(){
    if(timeleft > 4){
        clearInterval(downloadTimer);
        formBack.submit();
    }
    
    document.querySelector("font#fontCount").innerHTML = 5 - timeleft;
    timeleft += 1;
    }, 1000);
     
});