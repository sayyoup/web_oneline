/**
 * menu_list_page.js : 메뉴리스트 보이기
 */
document.addEventListener('DOMContentLoaded', function(){
    
    const inputCId = document.querySelector('input#inputCId');
    const btnBasket = document.querySelector('a#btnBasket');
    const btnGoBack = document.querySelector('a#btnGoBack');
    
    btnBasket.href = `/menu/menu_basket?c_id=${inputCId.value}`;
    btnGoBack.href = `/line/check_line?c_id=${inputCId.value}`;
    
    // cid에 해당하는 sore에 해당하는 모든 메뉴 리스트 반환
    // 메뉴리스트가 들어갈 테이블
    const tbodyMenuList = document.querySelector('tbody#tbodyMenuList');
    
    // 로고처리
    const h6Logo = document.querySelector('h6#h6Logo');
    h6Logo.addEventListener('click',function(){
        // 페이지 이동처리
        const url =`/line/check_line?c_id=${inputCId.value}`;
        location.href = url;
    }); 
    
    // 테이블을 메뉴 리스트로 체우기
    const makeTableListToMenu = (data) =>{
        tbodyMenuList.innerHTML='';
        let menuList ='';
        
        for(let menu of data){
            // 이미지설정 TODO
            let menuImage = ``; 
            if(menu.m_pic==null){
                menuImage = '/image/menu_image_ready.png';
            }else{
                menuImage = menu.m_pic;
            }
            // 글자크기 조정
            let name = menu.m_name;
            if(menu.m_name.length > 7){
                name = name.substr(0, 6);
                name += '...'
            }
            
            menuList +=`
                <tr>
                    <td style="text-align:left;" onclick="location.href='/menu/menu_detail?m_id=${menu.id}&c_id=${inputCId.value}'">
                        <div style="background: teal; width:80px ; height:80px;">
                            <img src="${menuImage}" alt="no" style="width:80px ; height:80px;">
                        </div>
                        <font  size=2>
                            ${name}
                        </font >         
                    </td>
                    <td style="text-align:left;" onclick="location.href='/menu/menu_detail?m_id=${menu.id}&c_id=${inputCId.value}'">
                        ${menu.m_price}원
                    </td>
                    <td>
                        <button data-id="${menu.id}" class="btnSaveMenu btn btn-outline-primary">담기</button>
                    </td>
                </tr>
            `;
        }
        // 테이블에 넣기
        tbodyMenuList.innerHTML += menuList;
        
        // 담기버튼처리 TODO
        const btnSaveMenus = document.querySelectorAll('button.btnSaveMenu');
        for(let btn of btnSaveMenus){
            btn.addEventListener('click', function(e){
                
                // 테이블아이디                
                const customerId = inputCId.value;
                // 메뉴아이디 찾기
                const menuId = e.target.getAttribute('data-id');
                
                const reqUrl = `/api/customer/getmeun/${customerId}`;
                const data= {customerId, menuId};
                
                axios.put(reqUrl, data)
                .then(()=>{
                    alert('담기성공');
                })
                .catch((error)=>{
                    console.log(error);
                });                
            });
        }
    };
    
    // 메뉴 전체 초기화
    const veiwAllMenuList = async () =>{
        const customerId = inputCId.value;
        const reqUrl = `/api/customer/all/menu/${customerId}`;
        try{
            const response = await axios.get(reqUrl)
            makeTableListToMenu(response.data); 
        }catch(error){
            console.log(error);
        }
    }
    
    veiwAllMenuList();
});