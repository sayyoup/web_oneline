/**
 * force_detail_price.js : 요금이 변동, 할인, 분할결제, 결제처리
 */

 document.addEventListener('DOMContentLoaded', function(){
     
     // 상황종료 콜백함수 
     const endSituation = () =>{
             // 모든 주문건 삭제                 
             const delUrl = `/api/dtable/delete/${deskId}`;
             axios.delete(delUrl)
             .then(()=>{
                 // 할인, 받은 금액 초기화
                 const disUrl = `/api/dtable/reset/price/${deskId}`;
                 axios.put(disUrl)
                 .then(()=>{})
                 .catch((erorr)=>{console.log(erorr)});
                 
                 //  이동
                formGoForceMain.submit();
             })
             .catch((erorr)=>{
                 console.log(erorr);
             });
     }
     
     // 쿼리 스트링 가져오기
     function searchParam(key) {
        return new URLSearchParams(location.search).get(key);
     };
     
     // destId
     const deskId = searchParam('id');
     
     // 금액추가 버튼처리
     const btnAddPrice = document.querySelector('button#btnAddPrice');
     btnAddPrice.addEventListener('click', function(){
         
        const inputCalculator = document.querySelector('input#inputCalculator').value;
        if(inputCalculator==''){
            alert('추가할 금액이 없습니다.');
            return;
        }
        if(inputCalculator.length>=7){
            alert('설정 가능한 금액 초과입니다.');
            return;
        }
        const reqUrl = `/api/dtable/add/price/${deskId}`; 
        data = { inputCalculator, deskId };
        
        axios.put(reqUrl, data)
        .then(()=>{
            // 새로고침
            location.reload(true);
        })
        .catch((error)=>{
            console.log(error);
        });
        
     });
     
     //할인금액 처리 인풋읽고 할인금을 그냥 변경
     const btnDiscount = document.querySelector('button#btnDiscount');
     btnDiscount.addEventListener('click', function(){
         const inputCalculator = document.querySelector('input#inputCalculator').value;
         if(inputCalculator==''){
             alert('할인할 금액이 없습니다.');
             return;
         }
         if(inputCalculator.length>=7 ){
             alert('설정 가능한 금액 초과입니다.');
             return;
         }
         confirm(inputCalculator+' 원을 할인 합니까?\n(총금액 초과시 자동 결제완료됩니다.)')
         
         const reqUrl = `/api/dtable/add/discount/${deskId}`; 
         
         data = { inputCalculator, deskId };
         axios.put(reqUrl, data)
         .then((response)=>{
            // 새로고침
             location.reload(true);
             if(response.data){
                  endSituation();
             }
         })
         .catch((error)=>{
             console.log(error);
         });
     });
     
     // 전체 취소 버튼 자리있으면 탈석시키고 메인으로이동, 없으면 그냥이동
     const formGoForceMain = document.querySelector('form#formGoForceMain');
     
     const btnAllCancel = document.querySelector('button#btnAllCancel');
     btnAllCancel.addEventListener('click', function(){
         
         const inputDeskState = document.querySelector('input#inputDeskState');
         if(inputDeskState.value==1){
            
            const check = confirm('정말 전체 취소합니까?\n(결제된 내용은 환불 됩니다.)');
            if(!check){
                return;
            }
            
         }else{
             formGoForceMain.submit();
             return;
         }
         
         const reqUrl = `/api/desk/change/state/${deskId}`;
         axios.put(reqUrl)
         .then(() => {
             endSituation();
          })
          .catch((error) =>{
              console.log(error);
          });
      });
      
        
     //0. 모달 체울 내용 미리만들기
     const getModalElemant = (data) => {
         
         // 인풋확인         
         const inputCalculator = document.querySelector('input#inputCalculator').value;
                  
         // 결제모달창 찾기
         const h1PayModalTitle = document.querySelector('h1#h1PayModalTitle');
         const spanAmountOfPayment = document.querySelector('span#spanAmountOfPayment');
         
         // 전체결제
         let h6ReceivePrice = document.querySelector('h6#h6ReceivePrice').innerHTML;
         // 결제할 금액
         let price = h6ReceivePrice.replace(' 원', '');
          
         // 승인 모달(계산기 값 비어있을때)
         if(inputCalculator==''){
            spanAmountOfPayment.innerHTML= price;
            
         // 계산기 값 체워져있을때
         }else{
            // 부분결제
            spanAmountOfPayment.innerHTML=inputCalculator;
         }
         
         // 결제완료 모달창
         const h1PayCModalTitle = document.querySelector('h1#h1PayCModalTitle');
         
         // 모달 버튼 찾기
         const btnATP = document.querySelector('button#btnATP');
         const btnFTP = document.querySelector('button#btnFTP');
         const btnETP = document.querySelector('button#btnETP');
         
         // 버튼 승인 콜백 메서드
         const payA = ()=>{
             btnATP.className= 'btnCPay btn btn-primary';
             btnFTP.className= 'btnCPay btn btn-secondary';
             btnETP.className= 'btn btn-secondary d-none';
         };
         payA();
         
         const payModalBody = document.querySelector('div#payModalBody');
         
         // 값이 이상하면 stateData의 모습변경
         let stateData = data;
         
         // 문제 1 총금액이 0원
         const totalPrice = document.querySelector('h6#h6TotalPrice').innerHTML;
         let totalIsZero = 0;
         if(totalPrice == '0 원'){
             totalIsZero = 1;
         }
         // 문제 2 받아야 할 금액이 0원
         let payIsZero = 0;
         if(price=='0'){
             payIsZero=1;
         }
         // 문제 3 테이블 착석상태가 아닐때 
         const inputDeskState = document.querySelector('input#inputDeskState');
         let notSit = 0;
         if(inputDeskState.value==0){
            notSit=1;
         }
         // 문제 4 받아야 할 총 금액보다 결제 금액이 클때
         let payPriceIsMorethenTotal = 0;
         if(spanAmountOfPayment.innerHTML > price){
             payPriceIsMorethenTotal = 1;
         }
         
         // 문제상황 한개라도 발생시 결제 안되게 막기
         if(totalIsZero || payIsZero || notSit || payPriceIsMorethenTotal){
             stateData= 'problem';
         }
         
         // + 버튼의 형태 변경
         // 결제할 금액
         if(stateData=='card'){
             h1PayModalTitle.innerHTML = '카드결제';
             h1PayCModalTitle.innerHTML = '카드결제';
             
             payModalBody.innerHTML = `
                <img src="/image/card.png" alt="payImage" style="height: 200px;"/> 
             `;
         }else if(stateData=='cash'){
             h1PayModalTitle.innerHTML = '현금결제';
             h1PayCModalTitle.innerHTML = '현금결제';
             
             payModalBody.innerHTML = `
                <img src="/image/cash.png" alt="payImage" style="height: 200px;"/> 
             `;
         }else if(stateData=='kakao'){
             h1PayModalTitle.innerHTML = '카카오결제';
             h1PayCModalTitle.innerHTML = '카카오결제';
             
             payModalBody.innerHTML = `
                <img src="/image/qr.png" alt="payImage" style="height: 200px;"/> 
             `;
         }else if(stateData=='qr'){
             h1PayModalTitle.innerHTML = '큐알결제';             
             h1PayCModalTitle.innerHTML = '큐알결제';
             
             payModalBody.innerHTML = `
                <img src="/image/qr.png" alt="payImage" style="height: 200px;"/> 
             `;
         }else{
             h1PayModalTitle.innerHTML = '결제실패';       
             spanAmountOfPayment.innerHTML = '0'; 
             // 버튼변경
             btnATP.className='btnCPay btn btn-primary d-none';
             btnFTP.className='btnCPay btn btn-secondary d-none';
             btnETP.className='btn btn-secondary';
             
             payModalBody.innerHTML = `
                결제할 수 없습니다.
             `;
         }
         
     };
     
     // 결제 완료 모달 처리
     const btnCPay = document.querySelectorAll('button.btnCPay');
     for(let btn of btnCPay){
         btn.addEventListener('click', function(e){
             
             const payYesOrNo = e.target.getAttribute('data-id');
             const payCModalBody = document.querySelector('div#payCModalBody');
             
             // 받아야 할 금액 
             const receivePrice = document.querySelector('h6#h6ReceivePrice').innerHTML;
             const rprice = receivePrice.replace(' 원', '')
             
             // 받은 금액 (결제할 금액)
             const amountOfPayment = document.querySelector('span#spanAmountOfPayment').innerHTML;
             
             // 3초후 이동 보일지 말지
             const divTreeSeconds = document.querySelector('div#divTreeSeconds');
             const endThePayModal = document.querySelector('button#endThePayModal');
             const spanTreeSecound = document.querySelector('span#spanTreeSecound');
            
             if(payYesOrNo=='y'){
                 // 결제성공
                 const requrl = `/api/dtable/pay/success/${deskId}`;
                 const data ={rprice, amountOfPayment};
                 
                 axios.put(requrl, data)
                 .then((response)=>{
                     if(response){ 
                         // 받은금액 처리
                         payCModalBody.innerHTML = '<img src="/image/success.gif" alt="success" style="height: 200px;">';
                         
                         //부분 결제 라면
                         if(response.data == 2){
                             spanTreeSecound.className='d-none';
                             location.reload(true);
                             return;
                             
                         //전체결제 라면
                         }else{                             
                             // 결제 완료 (모든금액 소진)
                             divTreeSeconds.className='text-center';
                             spanTreeSecound.className='';
                             //버튼 클릭시 바로이동
                             endThePayModal.addEventListener('click', function(){
                                 formGoForceMain.submit();
                             });        
                             let timeleft = 1;
                             let downloadTimer = setInterval(function(){
                             
                             if(timeleft >= 3){
                                clearInterval(downloadTimer);
                                formGoForceMain.submit();
                             }
                             document.querySelector("font#fontCount").innerHTML = 3 - timeleft;
                             timeleft += 1;
                             }, 1000);
                         }
                     }else{
                         location.reload(true);
                         payCModalBody.innerHTML = '<img src="/image/fail.gif" alt="fail" style="height: 200px;">';                 
                     }
                 })
                 .catch((erorr)=>{
                     console.log(erorr)
                 });
             }else{
                 // 결제실패
                 payCModalBody.innerHTML = '<img src="/image/fail.gif" alt="fail" style="height: 200px;">';
                 divTreeSeconds.className='text-center d-none';
             }
         });
     }

     // 1. 인풋확인 
     const btnPayment = document.querySelectorAll('button.btnPayment');
     for(let btnPay of btnPayment){
        btnPay.addEventListener('click', function(e){
             
             const payWay = e.target.getAttribute('data-id');
             getModalElemant(payWay);
             
             // 모달보이기
             
             document.querySelector('input#inputCalculator').value='';
         });
     }

 });