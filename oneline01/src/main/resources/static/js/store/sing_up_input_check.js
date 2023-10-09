/**
 * sing_up_input_check.js : 회원가입시 각 인풋 체크
 */
document.addEventListener('DOMContentLoaded', function(){
    
    // 1 input 이벤트가 발생했을때 해당  필요한 비교사항 (아이디, 비밀번호, 비밀번호 체크, 이메일)
    const username = document.querySelector('input#username');
    const password = document.querySelector('input#password');
    const passwordA = document.querySelector('input#passwordA');
    const email = document.querySelector('input#email');
    
    // 체크 div 
    const checkTheUserName = document.querySelector('div#checkTheUserName');
    const checkThePassword = document.querySelector('div#checkThePassword');
    const checkThePasswordA = document.querySelector('div#checkThePasswordA');
    const checkTheEmail = document.querySelector('div#checkTheEmail');
    
    // 체크 아이콘
    const usernameYesOrNoImage = document.querySelector('div#usernameYesOrNoImage');
    const passwordYesOrNoImage = document.querySelector('div#passwordYesOrNoImage');
    const passwordAYesOrNoImage = document.querySelector('div#passwordAYesOrNoImage');
    const emailYesOrNoImage = document.querySelector('div#emailYesOrNoImage');
    
    // 체크필드
    let uearNameCheck = 1;
    let passWordCheck = 1;
    let passWordACheck = 1;
    let emailCheck = 1;
    
    // 아이디가 비활성화 일때
    const userNameIsNotConfirm = ()=>{
        // 테두리 비활성화
        username.className='form-control my-2 bg-danger bg-opacity-25 border-danger';
        checkTheUserName.className='my-1 p-1';
        // 아이콘수정
        usernameYesOrNoImage.innerHTML=`
           <img src="/image/no.png" width="20px" height="20px" alt="no"/>
        `;
        uearNameCheck =1;
    };
    
    // 비밀번호가 비활성화 일때
    const passWordIsNotConfirm = ()=>{
        // 테두리 비활성화
        password.className='form-control bg-danger bg-opacity-25 border-danger';
        checkThePassword.className='my-1 p-1';
        // 아이콘수정
        passwordYesOrNoImage.innerHTML=`
           <img src="/image/no.png" width="20px" height="20px" alt="no"/>
        `;
        passWordCheck=1;
    };
    
    // 비밀번호체크가 비활성화 일때
    const passWordAIsNotConfirm = ()=>{
        // 테두리 비활성화
        passwordA.className='form-control bg-danger bg-opacity-25 border-danger';
        checkThePasswordA.className='my-1 p-1';
        // 아이콘수정
        passwordAYesOrNoImage.innerHTML=`
           <img src="/image/no.png" width="20px" height="20px" alt="no"/>
        `;
        passWordACheck=1;
    };
    
    // 비밀번호 체크인풋 상태초기화
    const resetPasswordA = () =>{
        // 테두리 비활성화
        passwordA.className='form-control';
        checkThePasswordA.className='my-1 p-1 d-none';
        passwordAYesOrNoImage.innerHTML=``;
        passwordA.value='';
        passwordA.disabled = true;  
        passWordACheck=1;
    };
    
    // 이메일체크가 비활성화 일때
    const emailIsNotConfirm = ()=>{
        // 테두리 비활성화
        email.className='form-control bg-danger bg-opacity-25 border-danger';
        checkTheEmail.className='my-1 p-1';
        // 아이콘수정
        emailYesOrNoImage.innerHTML=`
           <img src="/image/no.png" width="20px" height="20px" alt="no"/>
        `;
        emailCheck =1;
    };
    
    // username
    // 1.길이 체크,  2. 중복 체크, 3. 성공 시나리오
    username.addEventListener('input', async function(){
        // 1. 최소길이는 5글자이상이어야 한다.
        if(username.value.length < 5){
            // 비활성화
            userNameIsNotConfirm();
            // 문장 수정
            checkTheUserName.innerHTML =`
               <font class="text-danger" >
                   아이디는 최소한 다섯글자 이상 이어야 합니다.
               </font>
            `;
            return;
        }
        let userStr = username.value;
        // 2. 중복확인
        const reqUrl = `/api/store/check/id/${userStr}`;
        const response = await axios.get(reqUrl);
        if (response.data){
            userNameIsNotConfirm();
            // 문장 수정
            checkTheUserName.innerHTML =`
               <font class="text-danger" >
                   이미 존재하는 아이디입니다.
               </font>
            `;
            return;
        }

        // 성공시나리오
        username.className='form-control bg-success bg-opacity-25 border-success';
        checkTheUserName.className='my-1 p-1';
        // 아이콘수정
        usernameYesOrNoImage.innerHTML=`
           <img src="/image/yes.png" width="20px" height="20px" alt="yes"/>
        `;
        // 문장 수정
        checkTheUserName.innerHTML =`
           <font class="text-success" >
               사용 가능한 아이디입니다.
           </font>
        `;
        uearNameCheck=0;
    });
    
    // password
    password.addEventListener('input', async function(){
        
        // 1. 최소길이는 4글자이상이어야 한다.
        if(password.value.length < 4 || password.value.length > 20){
            // 비활성화
            passWordIsNotConfirm();
            // 문장 수정
            checkThePassword.innerHTML =`
               <font class="text-danger" >
                   비밀번호는 4자 이상, 20자 이하로 설정해주세요.
               </font>
            `;
            resetPasswordA();  
            return;
        }
        // 2. 안전성 체크 (특수문자)
        const specialWord = [`~`,`!`,`@`,`#`,`$`,`%`,`^`,`&`,`*`,`(`,`)`,`-`,`_`,`=`,`+`,`|`,`[`,`]`,`{`,`}`,`;`,`:`,`'`,`"`,`,`,`.`,`<`,`>`,`/`,`?`];
        
        let spCheck =0;
        for(let sp of specialWord){
            if (password.value.indexOf(sp) != -1) {
                spCheck = 1;
            }
        }
        
        if(!spCheck){
            passWordIsNotConfirm();
            // 문장 수정
            checkThePassword.innerHTML =`
               <font class="text-danger" >
                   비밀번호에는 특수문자를 포함해주세요.
               </font>
            `;
            // 비밀번호 체크문장
            resetPasswordA();  
            return;
        }
        
        
        
        // 성공시나리오
        password.className='form-control bg-success bg-opacity-25 border-success';
        // 아이콘수정
        passwordYesOrNoImage.innerHTML=`
           <img src="/image/yes.png" width="20px" height="20px" alt="yes"/>
        `;
        // 문장 수정
        checkThePassword.className='my-1 p-1';
        checkThePassword.innerHTML =`
           <font class="text-success" >
               사용 가능한 비밀번호입니다.
           </font>
        `;
        passwordA.disabled = false;    
        
        if(passwordA.value != ''){            
            // 비밀번호 체크
            if(passwordA.value==password.value){                
                passwordA.disabled = false;    
            }else{
                passWordAIsNotConfirm();
                // 문장 수정
                checkThePasswordA.innerHTML =`
                   <font class="text-danger" >
                       위 비밀번호와 일치하지 않습니다.
                   </font>
                `;
                passwordA.disabled = false;    
            }
        }
        passWordCheck=0;
    });
    
    // passwordA
    passwordA.addEventListener('input', function(){
        // 1. 위비밀번호 성공여부 체크.
        if(passwordA.value != password.value){
            passWordAIsNotConfirm();
            // 문장 수정
            checkThePasswordA.innerHTML =`
               <font class="text-danger" >
                   위 비밀번호와 일치하지 않습니다.
               </font>
            `;
            return;
        }
        
        // 성공시나리오
        passwordA.className='form-control bg-success bg-opacity-25 border-success';
        checkThePasswordA.className='my-1 p-1';
        // 아이콘수정
        passwordAYesOrNoImage.innerHTML=`
           <img src="/image/yes.png" width="20px" height="20px" alt="yes"/>
        `;
        // 문장 수정
        checkThePasswordA.innerHTML =`
           <font class="text-success" >
               위 비밀번호와 같습니다.
           </font>
        `;
        passWordACheck =0;
    });
    
    // email
    email.addEventListener('input', async function(){
        
        // 유효성 체크
        let eCheck =0;
        let emailWord = email.value; 
        if(emailWord.indexOf('@') != -1){
            if(emailWord.indexOf('.') != -1){
                eCheck = 1;
            }
        }
        if(!eCheck){
            emailIsNotConfirm();
            // 문장 수정
            checkTheEmail.innerHTML =`
               <font class="text-danger" >
                   유효한 이메일을 적어주세요
               </font>
            `;
            return;
        }  

        // 2. 중복확인
        // 중복체크
        let emailStr = email.value;
        const reqUrl = `/api/store/check/email/${emailStr}`;
        const response = await axios.get(reqUrl);
        if (response.data){
            emailIsNotConfirm();
            // 문장 수정
            checkTheEmail.innerHTML =`
               <font class="text-danger" >
                   중복된 이메일입니다.
               </font>
            `;
            return;
        }           
           
        // 성공시나리오
        email.className='form-control bg-success bg-opacity-25 border-success';
        checkTheEmail.className='my-1 p-1';
        // 아이콘수정
        emailYesOrNoImage.innerHTML=`
           <img src="/image/yes.png" width="20px" height="20px" alt="yes"/>
        `;
        // 문장 수정
        checkTheEmail.innerHTML =`
           <font class="text-success">
               사용 가능한 이메일 입니다. 
           </font>
        `;
        emailCheck =0;
    });
    
    const btnCreateNewStore = document.querySelector('button#btnCreateNewStore');
    
    btnCreateNewStore.addEventListener('click', function(){
        
        // 전체 체크
        if(uearNameCheck){
            alert('아이디를 체크해 주세요');
            return;
        }
        
        if(passWordCheck){
            alert('비밀번호를 체크해 주세요');
            return;
        }
        
        if(passWordACheck){
            alert('비밀번호 확인란을 체크해 주세요');
            return;
        }
        
        if(emailCheck){
            alert('이메일을 체크해 주세요');
            return;
        }
        
        const formNewStore = document.querySelector('form#formNewStore');
        formNewStore.submit();
        alert('아이디 생성 완료');
        
    });
    
    
});