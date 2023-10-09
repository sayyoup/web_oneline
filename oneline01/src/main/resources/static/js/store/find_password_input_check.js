/**
 * find_password_input_check : 인풋 체크하고 유효한 유저정보가 있읋때만 submit 보내기
 */
document.addEventListener('DOMContentLoaded', function(){

    // 인풋 확인    
    const username = document.querySelector('input#username');
    const email = document.querySelector('input#email');
    
    // 시간이 들어갈 곳
    const divTime = document.querySelector('div#divTime');
    divTime.className ='row p-1 my-1 d-none';
    
    const fontLeftTime = document.querySelector('font#fontLeftTime');

    // 인증인풋이 담긴 div : 보기비활성화
    const divAuthenticate = document.querySelector('div#divAuthenticate');
    divAuthenticate.className ='row p-1 my-1 d-none';
    
    // 인증번호 인풋
    const cerNumber = document.querySelector('input#cerNumber');
    // 재전송 버튼
    const btnRetry = document.querySelector('button#btnRetry');
    // 인증 발송버튼
    const btnSendCode = document.querySelector('button#btnSendCode');
    cerNumber.disabled = false;
    btnRetry.disabled = false;
    btnSendCode.disabled = false;
    username.disabled = false;
    document.querySelector('input#email').readonly = false;

    // 최종 찾기 버튼
    const btnFindPassword = document.querySelector('button#btnFindPassword');
    btnFindPassword.addEventListener('click', function(){
        
        const formNewPassword = document.querySelector('form#formNewPassword');
        formNewPassword.submit();
        
    });

    // 인증하기 버튼 처리
    const btnAuthenticate = document.querySelector('button#btnAuthenticate');
    btnAuthenticate.addEventListener('click', function(){
        
        // 같이보낼거
        const em = document.querySelector('input#email').value;
        const code = document.querySelector('input#cerNumber').value;
                
        // 인증맞는지 체크 아니면 리턴
        const reqUrl3 = `/api/store/certification`;
        const data3 = {code, em};
        
        axios.post(reqUrl3, data3)
        .then((response)=>{
            
            // 실패 시나리오
            if(response.data){
                alert('코드가 정확하지 않습니다.');
                return;
            // 성공시나리오
            }else{       
                // 인풋을 비활성화
                cerNumber.disabled = true;
                btnRetry.disabled = true;
                leftTime =0;
                setTimeout(function(){
                    fontLeftTime.innerHTML ='인증완료';
                    alert('인증완료');
                    btnFindPassword.disabled = false;
                },1000);
            }
        })
        .catch((error)=>{
            console.log(error);
        }); 
    });
        
    //시간 설정
    let leftTime = 300;
    let min ='';
    let sec ='';
        
    // 인증 전송버튼처리
    btnSendCode.addEventListener('click', function(){
        // 빈값인지 확인
        if(username.value.length < 5 || email.value.length < 5){
            alert('아이디/이메일을 확인 후 시도해주세요');
            return;
        }
        // 보내기 설정
        const nameStr = username.value;
        const emailStr = email.value;
        const reqUrl = `/api/store/check/authenticate`;
        const data = {nameStr, emailStr};
        axios.post(reqUrl, data)
        .then((response) =>{
            if(!response.data){
                
                // TODO 이메일로 전송
                const reqUrl2 = `/api/store/emailConfirm`;
                const data2 = {emailStr};
                
                axios.post(reqUrl2, data2)
                .then(()=>{
                    alert('이메일 전송완료, 전송받은 코드를 입력해 주세요');
                })
                .catch((error)=>{
                    console.log(error);
                });
                
                //인풋비활성화
                username.disabled = true;
                document.querySelector('input#email').readonly = true;
                
                // 발송버튼 비활성화
                btnSendCode.disabled = true;
                
                // 5분 타임어텍 시작 재전송 버튼 활성화
                divTime.className ='row p-1 my-1';
                divAuthenticate.className ='row p-1 my-1';
                const timer = setInterval(function() {
                    // 인증완료 비활성화 풀기
                    btnAuthenticate.disabled = false;
                    
                    // 시간 설정
                    min = parseInt(leftTime/60);
                    sec = leftTime%60;
                    
                    // 시간 넣기
                    fontLeftTime.className ='';
                    fontLeftTime.innerHTML =`${min} : ${sec}`;
                    leftTime--;
                    
                    if(leftTime < 0){
                        // 메서드종료
                        clearInterval(timer);
                        // 시간완료 표시
                        fontLeftTime.className ='text-danger';
                        fontLeftTime.innerHTML ='시간 초과';
                        
                        // 인증완료 비활성화
                        btnAuthenticate.disabled = true;
                    }
                }, 1000);
                
            }else if(response.data == 1){
                alert('존재하지 않는 아이디입니다.');
                return;  
            }else{
                alert('가입시 작성한 이메일로 시도해 주세요.');                                
                return;  
            }
        })
        .catch((error)=>{
            console.log(error);
        });
    });
    
    // 재전송 버튼 처리
    btnRetry.addEventListener('click', function(){
        
        const nameStr = username.value;
        let emailStr = email.value;
        console.log(emailStr);
        const reqUrl2 = `/api/store/emailConfirm`;
        const data2 = {emailStr, nameStr};
        
        axios.post(reqUrl2, data2)
        .then(()=>{
            alert('재전송 되었습니다.');
        })
        .catch((error)=>{
            console.log(error);
        });
                        
        // 기존 타이머 새로고침으로 종료
        leftTime =0;
        setTimeout(function(){
            // 남은시간 초기화
            leftTime =300;
            const timer = setInterval(function() {
                // 인증완료 비활성화 풀기
                btnAuthenticate.disabled = false;
                
                // 시간 설정
                min = parseInt(leftTime/60);
                sec = leftTime%60;
                
                // 시간 넣기
                fontLeftTime.className ='';
                fontLeftTime.innerHTML =`${min} : ${sec}`;
                leftTime--;
                
                if(leftTime < 0){
                    // 메서드종료
                    clearInterval(timer);
                    // 시간완료 표시
                    fontLeftTime.className ='text-danger';
                    fontLeftTime.innerHTML ='시간 초과';
                    // 인증완료 비활성화
                    btnAuthenticate.disabled = true;
                }
            }, 1000);
        },1100);
    });
    
});