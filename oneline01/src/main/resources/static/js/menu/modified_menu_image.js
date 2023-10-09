/**
 * 메뉴수정하기 페이지 이미지 수정시 처리 
 */
document.addEventListener('DOMContentLoaded', function(){
        
    // 이름 내용    
    const m_name = document.querySelector('input#m_name');
    document.querySelector('input#hInputNmae').value = m_name.value;

    // 사진 수정하기버튼
    const btnShowImageModified = document.querySelector('button#btnShowImageModified')
    btnShowImageModified.disabled=true;
    
    // 사진 수정하기 div
    const divModifiedImage = document.querySelector('div#divModifiedImage');
    
    m_name.addEventListener('input', function(){
        document.querySelector('input#hInputNmae').value = m_name.value;
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
        document.querySelector('input#hInputNmae').value = m_name.value;
        
        m_name.disabled = true;
        nameSaver.disabled = true;
        btnShowImageModified.disabled=false;
        alert('설정 완료');
    });
    
    // 사진수정하기 버튼 누르면 수정할 수 있는 창이 보인다.
    btnShowImageModified.addEventListener('click', function(){
        divModifiedImage.className = 'row p-1 my-1';        
    });
        
    // 숨겨서 보낼 파일 인풋내용
    const hInputPic = document.querySelector('input#hInputPic');
    
    const inputM_pic = document.querySelector('input#m_pic');
    inputM_pic.addEventListener('input', function(){
        
        const reqUrl = '/file/image/get/return/url';   
        const imageFile = inputM_pic.files[0];
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
            hInputPic.value = response.data;
        })
        .catch((error)=>{
            console.log(error);
        });        
    });
});