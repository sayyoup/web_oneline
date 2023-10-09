/**
 * menu_detail_page.js: 메뉴 디테일 페이지
 */
document.addEventListener('DOMContentLoaded', function(){
    
    // 아이디값 찾기
    const inputCId = document.querySelector('input#inputCId');
    const inputMId = document.querySelector('input#inputMId');
    
    // 로고처리
    const h6Logo = document.querySelector('h6#h6Logo');
    h6Logo.addEventListener('click',function(){
        // 페이지 이동처리
        const url =`/line/check_line?c_id=${inputCId.value}`;
        location.href = url;
    }); 
    
    const btnGoBack = document.querySelector('button#btnGoBack');
    btnGoBack.addEventListener('click', function(){
        // 페이지 이동처리
        const url =`/menu/menu_list?c_id=${inputCId.value}`;
        location.href = url;        
    });
    
    
    // 채울 div
    const h2MenuName = document.querySelector('h2#h2MenuName');    
    const h4MenuDec = document.querySelector('h4#h4MenuDec');
    const divMenuImage = document.querySelector('div#divMenuImage');
    
    let Mcount = 0;
    
    // 디테일 요소 체우기
    const makeMenuElemant = (data) =>{
        
        // 무한 재고수 처리
        if(data.m_stock==99999){
            Mcount = -1;
        }else {
            Mcount = data.m_stock - data.m_solded
        }
        
        let pic = data.m_pic;
        // 만일 이미지가 없다면
        if(data.m_pic==null){
            pic ='/image/menu_image_ready_big.png';
        }
        
        h2MenuName.innerHTML =`${data.m_name}`;
        h4MenuDec.innerHTML =`${data.m_des}`;
        
        divMenuImage.innerHTML =`<img src="${pic}" alt="menuImage" style="height:200px; width: 200px;">`;
        
    };
    
    const setMenu = async () => {
        const menuId = inputMId.value;
        const reqUrl = `/api/menu/view/detail/${menuId}`;
        try{
            const response = await axios.get(reqUrl);
            makeMenuElemant(response.data);
        }catch(error){
            console.log(error);
        }
    };
    
    const fontMenuCount = document.querySelector('font#fontMenuCount');
    fontMenuCount.innerHTML =1;
    
    // 추가 삭제 버튼처리
    const btnMinus = document.querySelector('button#btnMinus');
    btnMinus.addEventListener('click',function(){
        // 더이상 줄일 수 없음
        let count = fontMenuCount.innerHTML;
        if(count == 1){
            alert('더이상 줄일 수 없습니다.');
            return;
        }
        // 수 줄이기
        fontMenuCount.innerHTML = count-1;
    });
    
    const btnPlus = document.querySelector('button#btnPlus');
    btnPlus.addEventListener('click',function(){
        let count = fontMenuCount.innerHTML;
        
        if(Mcount == -1){
            fontMenuCount.innerHTML = parseInt(count)+1;
            return;
        }
        if(fontMenuCount.innerHTML >= Mcount){
            alert('판매갯수 초과');
            return;
        }else{            
            fontMenuCount.innerHTML = parseInt(count)+1;
        }
        // 수늘리기
    });
    
    // 담기버튼 처리
    const btnGetToBasket = document.querySelector('button#btnGetToBasket');
    btnGetToBasket.addEventListener('click', function(){
        
        const count = fontMenuCount.innerHTML;
        const cid = inputCId.value;
        const mid = inputMId.value;
        const data={cid, mid, count};
        const reqUrl = `/api/customer/add/basket/${cid}`;
        
        axios.put(reqUrl, data)
        .then((response)=>{
            // 성공
            if(!response.data){
                alert('저장성공');
                // 페이지 이동처리
                const url =`/menu/menu_list?c_id=${cid}`;
                location.href = url;
            }else{
                alert(`저장 실패 : 현재 담기가능 갯수 ${response.data}`);
                fontMenuCount.innerHTML = response.data;
                return;
            }
        })
        .catch((error)=>{
            console.log(error);
        });
    });
    
    setMenu();
});