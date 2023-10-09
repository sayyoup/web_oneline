/**
 * send_line_masegge : 메세지 보내기 설정
 */
document.addEventListener('DOMContentLoaded',function(){
    
    const inputStoreId = document.querySelector('input#inputStoreId');
        
    const btnRegistration = document.querySelector('button#btnRegistration');
    const formCreateLine = document.querySelector('form#formCreateLine');
        
    btnRegistration.addEventListener('click', function(){
        
        const inputPhone = document.querySelector('input#inputPhone').value;
        const inputMember = document.querySelector('input#inputMember').value;
        
        if(inputPhone.length==13){
            if(inputMember.length > 0 && inputMember.length < 3){
                
                // 인풋 다받기 
                const phone = inputPhone;
                const member = inputMember;
                const storeId = inputStoreId.value;
                
                // 커스터머를 하나 추가후 해당 아이디를 뱉는 post mapping axios
                const reqUrl = `/api/kakao/create/customer/${storeId}`;
                const data = {phone, member, storeId};
                
                axios.post(reqUrl, data)
                .then((response)=>{
                    const customerId = response.data;
                    const qUrl =`http://192.168.20.18:8090/line/check_line?c_id=${customerId}`;
                    // 카카오톡 메시지 설정하기
                    try {
                        function sendLinkDefault() {
                            Kakao.init('f2c374dc0727e58275fef9d4f80d2bb7')
                            Kakao.Link.sendDefault({
                                objectType: 'feed',
                                content: {
                                    title: '줄서기 등록 완료!',
                                    description: '하단의 링크를 통해 내 순서를 확인 하거나, 미리 주문할 수 있습니다.',
                                    imageUrl: qUrl,
                                    link: {
                                    mobileWebUrl: qUrl,
                                    webUrl: qUrl,
                                    },
                                },
                                buttons: [
                                    {
                                        title: '내순서 확인하기',
                                        link: {
                                            mobileWebUrl: qUrl,
                                            webUrl: qUrl,
                                        },
                                    },
                                ],
                            })
                        }
                        ; window.kakaoDemoCallback && window.kakaoDemoCallback() }
                    catch(e) { window.kakaoDemoException && window.kakaoDemoException(e) 
                        console.log(e);
                    }
                    
                    sendLinkDefault();
                    formCreateLine.submit();
                })
                .catch((error)=>{
                    console.log(error);
                });
                
                
                // 성공시 response.data로 받은 아이디로 링크를 만들어 메시지를 보내기 
                
                return;            
            }else{
                alert('정확한 인원수를 입력해 주세요');
                return;            
            }
        }else{
            alert('정확한 전화번호를 입력해 주세요');
            return;            
        }
    });
    
    
});