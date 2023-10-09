/**
 * line_page.js: 줄서기 페이지 관리
 */
document.addEventListener('DOMContentLoaded',function(){
    
    // TODO Customer 정보 얻기
    const c_id = document.querySelector('input#inputc_id').value;
    
    // 새로고침 버튼처리
    const btnNewPage = document.querySelector('button#btnNewPage');

    // 로고처리
    const h6Logo = document.querySelector('h6#h6Logo');
    h6Logo.addEventListener('click',function(){
        // 페이지 이동처리
        const url =`/line/check_line?c_id=${c_id}`;
        location.href = url;
    }); 
    
    // 순번    
    const h1CNumber = document.querySelector('h1#h1CNumber');
    // 내앞 남은인원 + 예상시간
    const h3ExpectationWaitingTime = document.querySelector('div#divExpectationWaitingTime');
    
    const makeCostomerElement = (data) =>{
        
        const btnPreOrder = document.querySelector('a#btnPreOrder');
        const btnSeeMyOrder = document.querySelector('a#btnSeeMyOrder');
        
        // 빈값일때
        if(data == ''){
            h1CNumber.innerHTML ='만료되었습니다.';
            h3ExpectationWaitingTime.innerHTML ='';
            
            //버튼 비활성화
            btnNewPage.className = 'd-none';
            btnPreOrder.className = 'd-none';
            btnSeeMyOrder.className = 'd-none';
            return;
        }
        
        
        h1CNumber.innerHTML=`${data.c_number}번`;
        
        let leftTeamInt = data.leftTeam;
        let leftTimeInt = data.leftTime;
        
        btnPreOrder.className ='btn btn-primary my-1';
        btnSeeMyOrder.className ='btn btn-primary my-1';
        
        // 내앞 순서가 2팀 이내일때
        if(leftTeamInt<=0){
            
        btnPreOrder.className ='btn btn-primary my-1 d-none';
            
        h3ExpectationWaitingTime.innerHTML= `
            <font class="form-floating my-3 p-1">매장에 입장해 주세요.</font>
            <br/>
            <br/>
            <font class="form-floating my-1 p-1">(10분내로 미입장 취소 처리됩니다.)</font>
        `;}
        // 내앞 팀이 없을때
        else if (leftTeamInt<=2&&leftTeamInt>0){
        h3ExpectationWaitingTime.innerHTML= `
            <font class="form-floating my-3 p-1">곧 입장을 알려드리겠습니다.</font>
            <br/>
            <br/>
            <font class="form-floating my-1 p-1">매장 근처에서 대기해 주세요</font>        
        `;}
        else{
        h3ExpectationWaitingTime.innerHTML= `
            <font class="form-floating my-3 p-3">내앞에 ${leftTeamInt} 팀 남았습니다.</font>
            <br/>
            <br/>
            <font class="form-floating my-1 p-1">예상 대기시간 : (${leftTimeInt} 분)</font>        
        `;
        }
        
    };// 기다리는 시간
    const getCostomerInfo = async () =>{
        const reqUrl = `/api/customer/read/all/${c_id}`;
        const response = await axios.get(reqUrl);
        makeCostomerElement(response.data);
    }
    
    // 새로고침 버튼 처리
    btnNewPage.addEventListener('click', function(){
        getCostomerInfo();
    });
    
    getCostomerInfo();
});