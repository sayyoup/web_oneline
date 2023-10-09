/**
 * new_password_input_check.js: 
 */
document.addEventListener('DOMContentLoaded', function(){

    // 인풋
    const password = document.querySelector('input#password');
    const passwordA = document.querySelector('input#passwordA');
    // div
    const checkThePassword = document.querySelector('div#checkThePassword');
    const checkThePasswordA = document.querySelector('div#checkThePasswordA');
    // 아이콘
    const passwordYesOrNoImage = document.querySelector('div#passwordYesOrNoImage');
    const passwordAYesOrNoImage = document.querySelector('div#passwordAYesOrNoImage');
    // 필드
    let passWordCheck = 1;
    let passWordACheck = 1;
    
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
    
    password.addEventListener('input',  async function(){
        
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
    
    passwordA.addEventListener('input',function(){
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
    
    const btnUpdatePassword = document.querySelector('button#btnUpdatePassword');
    btnUpdatePassword.addEventListener('click', function(){
        
        if(passWordCheck){
            alert('비밀번호창이 알맞지 않습니다.');
            return;
        }
        
        if(passWordACheck){
            alert('비밀번호 확인창이 알맞지 않습니다.');
            return;
        }
        alert('변경되었습니다.');
        const form = document.querySelector('form#form');
        form.submit();
    });
    
});