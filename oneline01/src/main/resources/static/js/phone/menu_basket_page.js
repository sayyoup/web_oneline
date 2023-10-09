/**
 * menu_basket_page : 메뉴 장바구니에서 처리되는 페이지
 */
document.addEventListener('DOMContentLoaded', function(){
    
    // c id
    const inputCId = document.querySelector('input#inputCId');
    const cid = inputCId.value;
    
    // 주문, 추가주문 버튼
    const btnOrder = document.querySelector('button#btnOrder');
    btnOrder.addEventListener('click', function(){
        
        const reqUrl = `/api/customer/basket/order/${cid}`;
        axios.put(reqUrl)
        .then(()=>{
            alert('주문 완료');
            // 페이지 이동처리
            const url =`/line/check_line?c_id=${cid}`;
            location.href = url;
        })
        .catch((error)=>{
            console.log(error);
        });
    });
    
    const btnAddBasket = document.querySelector('button#btnAddBasket');    
    btnAddBasket.addEventListener('click', function(){
        // 페이지 이동처리
        const url =`/menu/menu_list?c_id=${cid}`;
        location.href = url;
    });
    
    // 로고처리
    const h6Logo = document.querySelector('h6#h6Logo');
    h6Logo.addEventListener('click',function(){
        // 페이지 이동처리
        const url =`/line/check_line?c_id=${cid}`;
        location.href = url;
    }); 
    
    // 1. 장바구니 리스트 보이기
    const makeBasketListElemant = (data) => {
        
        const tbodyBasketList = document.querySelector('tbody#tbodyBasketList');
        tbodyBasketList.innerHTML = '';

        const fontTotalPrice = document.querySelector('font#fontTotalPrice');
        fontTotalPrice.innerHTML = '';
        
        let menuList = '';
        
        // 빈값
        if(data == ''){
            tbodyBasketList.innerHTML += `
                <tr class="text-center">
                    <td colspan="3">
                        <img src="/image/no_contant.png" alt="no" style=width:300px ; height:300px;">
                    <td>
                </tr>
            `;
            fontTotalPrice.innerHTML = 0;
            // 버튼 비활성화
            btnOrder.disabled = true;
            return;
        }
        
        
        let totalprice = 0;
        
        for(let el of data){
            
            // 총금액 처리
            totalprice += el.m_price;
            
            // 이름 길이 처리
            let name = el.m_name;
            if(el.m_name.length >= 7){
                name =  el.m_name.substr(0,6) + '...';
            }
            //사진 처리
            let pic = el.m_pic;
            if(el.m_pic==null){
                pic = '/image/menu_image_ready.png';
            }
            
            // 체우기
            menuList += `
                <tr data-id="${el.m_id}">
                    <td class="modalEventClass" data-id="${el.m_id}" style="text-align:left;" data-bs-toggle="modal" data-bs-target="#menuDetailModal">
                        <div data-id="${el.m_id}">
                            <img src="${pic}" data-id="${el.m_id}" alt="menuImage" style="background: teal; width:80px ; height:80px;">
                        </div>
                        <font data-id="${el.m_id}" size=2>
                            ${name}
                        </font >         
                    </td>
                    <td class="modalEventClass" data-id="${el.m_id}" style="text-align:left;" data-bs-toggle="modal" data-bs-target="#menuDetailModal">
                        ${el.m_price} 원
                    </td>
                    <td>
                        <button data-id="${el.b_id}" class="btnMinus btn btn-outline-primary">-</button>
                        <span id="spanCount_${el.b_id}">${el.b_count}</span>
                        <button data-id="${el.b_id}" class="btnPlus btn btn-outline-primary">+</button>
                    </td>
                </tr>
            `;
        } 
        tbodyBasketList.innerHTML += menuList;
        fontTotalPrice.innerHTML += totalprice;
        
        // 모달 클릭이벤트 처리
        const modalEventClass = document.querySelectorAll('td.modalEventClass');
        for(let mo of modalEventClass){
            mo.addEventListener('click', async function(e){
                
                const menuId = e.target.getAttribute('data-id');
                const reqModalUrl =`/api/menu/view/detail/${menuId}`;
                
                // 모달에 체울 객체들
                const h1MenuDetailModalName = document.querySelector('h1#h1MenuDetailModalName');
                const divMenuDetailModalImage = document.querySelector('div#divMenuDetailModalImage');
                const divMenuDetailModalPrice = document.querySelector('div#divMenuDetailModalPrice');
                const divMenuDetailModalDescription = document.querySelector('div#divMenuDetailModalDescription');
                
                try{                
                    h1MenuDetailModalName.innerHTML = ``;
                    divMenuDetailModalImage.innerHTML = ``;
                    divMenuDetailModalPrice.innerHTML = ``;
                    divMenuDetailModalDescription.innerHTML = ``;
                    
                    const response = await axios.get(reqModalUrl);    
                    
                    const menu = response.data;
                    let pic = menu.m_pic;
                    if(menu.m_pic == null){
                        pic = `/image/menu_image_ready_big.png`;
                    }
                    
                    h1MenuDetailModalName.innerHTML = `${menu.m_name}`;
                    divMenuDetailModalImage.innerHTML = `<img src="${pic}" alt="menuImage" style="background: teal; width:200px ; height:200px;">`;
                    divMenuDetailModalPrice.innerHTML = `${menu.m_price} 원`;
                    divMenuDetailModalDescription.innerHTML = `${menu.m_des}`;
                    
                }catch(error){
                    console.log(error);
                }
                
                
            });
        }
        
        // 마이너스 버튼처리
        const btnMinus =document.querySelectorAll('button.btnMinus');
        for(let btn of btnMinus){
            btn.addEventListener('click', function(e){
                
                const b_id = e.target.getAttribute('data-id');
                const spanCount = document.querySelector(`span#spanCount_${b_id}`);
                
                let count = parseInt(spanCount.innerHTML)-1;
                
                // 삭제
                if(count==0){
                    const delUrl = `/api/customer/basket/delete/${b_id}`;
                    axios.delete(delUrl)
                    .then(()=>{
                        getListFormat();
                    })
                    .catch((error)=>{
                        console.log(error);
                    });
                    return;
                }
                
                // 갯수 수정
                const reqUrl = `/api/customer/basket/minus/${b_id}`;
                axios.put(reqUrl, count)
                .then(()=>{
                    getListFormat();
                })
                .catch((error)=>{
                    console.log(error);
                });
            });
        }
        // 플러스버튼처리
        const btnPlus =document.querySelectorAll('button.btnPlus');
        for(let btn of btnPlus){
            btn.addEventListener('click', function(e){
                
                const b_id = e.target.getAttribute('data-id');
                const spanCount = document.querySelector(`span#spanCount_${b_id}`);
                let count = parseInt(spanCount.innerHTML)+1;
                
                // 갯수 수정
                const reqUrl = `/api/customer/basket/plus/${b_id}`;
                axios.put(reqUrl, count)
                .then((response)=>{
                    if(response){
                        getListFormat();
                    }else{
                        alert('일일 판매갯수 초과');
                        return;
                    }
                })
                .catch((error)=>{
                    console.log(error);
                });
            });
            
            
        }
    };
    
    // 테이블 초기화
    const getListFormat = async ()=>{
        const reqUrl = `/api/customer/read/all/basket/${cid}`;
        try{
            const response = await axios.get(reqUrl); 
            makeBasketListElemant(response.data);
        }catch(error){
            console.log(error);
        }
    };
    
    // 주문하기 버튼처리
    
    
    getListFormat();
});