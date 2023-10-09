/**
 * login_check.js: 로그인 체크 실패시 인풋 css변경, 성공시 버튼 주소 변경
 */
document.addEventListener('DOMContentLoaded', function(){
    
    // 인풋 찾기
    const inputUsername = document.querySelector('input#username');
    const inputPassword = document.querySelector('input#password');
    
    const worngFont = document.querySelector('font#worngFont');
    
    // 로그인 버튼처리
    const btnLogin = document.querySelector('button#btnLogIn');
    btnLogin.addEventListener('click', function(){
        
        // 1. 인풋으로 유저정보 get으로 읽기(성공 실패)
        // 인풋값
        const username = inputUsername.value;
        const password = inputPassword.value;
        
        // 빈값 체크
        if(username.length < 4){
            worngFont.classList.remove('d-none');
            worngFont.innerHTML ='아이디가 정확하지 않습니다.';
            // 색상변경
            inputUsername.className='form-control my-2 bg-danger bg-opacity-25 border-danger';
            
            // 흔들기
            inputUsername.classList.add('vibration');
            // 흔들기 설정 제거
            setTimeout(function(){
                inputUsername.classList.remove('vibration');
            },400);
            return;
        }
        if(password.length < 4 || password.length > 20){
            worngFont.classList.remove('d-none');
            worngFont.innerHTML ='비밀번호가 정확하지 않습니다.';
            // 색상변경
            inputPassword.className='form-control my-2 bg-danger bg-opacity-25 border-danger';

            // 흔들기
            inputPassword.classList.add('vibration');

            // 흔들기 설정 제거
            setTimeout(function(){
                inputPassword.classList.remove('vibration');
            },400);
            return;
        }
        
        const reqUrl = `/api/store/login/check`;
        const data ={username, password};
        
        axios.post(reqUrl, data)
        .then((response)=>{
            
            //성공 == storeId 리턴
            if(response.data){
                
                const formLogin = document.querySelector('form#formLogin');
                formLogin.submit();
                return;
            // 실패
            }else{
                
                worngFont.classList.remove('d-none');
                worngFont.innerHTML ='아이디/비밀번호가 정확하지 않습니다.';
                
                inputUsername.className='form-control my-2 bg-danger bg-opacity-25 border-danger';
                inputPassword.className='form-control my-2 bg-danger bg-opacity-25 border-danger';
                // TODO 인풋 흔들리기
                inputUsername.value = '';
                inputPassword.value = '';
                // 흔들기
                inputUsername.classList.add('vibration');
                inputPassword.classList.add('vibration');

                // 흔들기 설정 제거
                setTimeout(function(){
                    inputUsername.classList.remove('vibration');
                    inputPassword.classList.remove('vibration');
                },400);

                
                return;
            }
        })
        .catch((error)=>{
           console.log(error); 
        });
    });
    
});