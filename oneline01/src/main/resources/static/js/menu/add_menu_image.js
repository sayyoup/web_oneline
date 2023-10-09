/**
 * add_menu_image.js : 저장된 메뉴이미지 처리
 */
document.addEventListener('DOMContentLoaded', function(){
      
    // 파일 인풋
    const file_m_pic = document.querySelector('input#m_pic');
    file_m_pic.disabled = true;
    
    // 체워보낼 인풋
    const input_pic = document.querySelector('input#input_pic');  
    // 이름 내용    
    const m_name = document.querySelector('input#m_name');

    m_name.addEventListener('input', function(){
        document.querySelector('input#nameSet').value = m_name.value;
    });
    
    const nameSaver = document.querySelector('button#nameSaver');
    nameSaver.addEventListener('click',function(){
        
        if(m_name.value.length < 1){
            alert('이름이 비어있습니다.');
            return;
        }
        const check = confirm(`${m_name.value} 로 이름을 설정하시겠습니까?`);
        if(!check){
            return;
        }
        m_name.disabled = true;
        file_m_pic.disabled = false;
        nameSaver.disabled = true;
        alert('설정 완료');
    });
    
    // 파일 변경 처리
    file_m_pic.addEventListener('input', function(){
        
        const reqUrl = '/file/image/get/return/url';   
        const imageFile = file_m_pic.files[0];
        const name = m_name.value;
        
        // formData
        let formdata = new FormData();
        formdata.append('imageFile', imageFile);
        formdata.append('name', name);
        
        console.log(formdata)
        // 파일을 보냄
        axios.post(reqUrl, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response)=>{
            // 요청문 문자로 전달받음 > 인풋에 설정함 (빈값일땐 빈값으로 넘어온다.)
            console.log(response.data);
            input_pic.value=response.data;
        })
        .catch((error)=>{
            console.log(error);
        });
        // 컨트롤러로 해당파일을 전달하고 리턴값으로받은 src를 input_pic의 value로 설정
        
    });
    
});