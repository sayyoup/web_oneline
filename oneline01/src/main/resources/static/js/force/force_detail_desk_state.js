/**
 * force_detail_desk_state.js: 데트스 상테 읽고 반환
 */
document.addEventListener('DOMContentLoaded', function(){
        
    // 데스크 상태표시창 콜백함수
    const deskStateCheck = () => {
        const inputDeskState = document.querySelector('input#inputDeskState');
        //자리 참
        if(inputDeskState.value==1){
            document.querySelector('th#thDeskState').innerHTML =`(O)`;
        //안참
        }else{
            document.querySelector('th#thDeskState').innerHTML =`(X)`;
        }
    };
    
    // 페이지 열렸을때 초기화
    deskStateCheck();
});