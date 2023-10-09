/**
 * force_desk_detail_menuList.js : 메뉴리스트 js
 */
 document.addEventListener('DOMContentLoaded',function(){
     
     //영업종료 선언
     const aEndStore = document.querySelector('a#aEndStore');
     aEndStore.addEventListener('click', function(){
         const check = confirm('영업종료하시겠습니까?');
         if(!check){
             return;
         }
        
         // 페이지 이동처리
         const url =`/api/store/end/today/${storeId}`;
         axios.delete(url)
         .then(()=>{
             location.href = "/logout";
         })
         .catch((error)=>{
             console.log(error);
         });
     });
     
     const MakePriceElement = (data) =>{
     
         // 총금액, 할인금액, 결제금액, 받을금액 정리
         const h6TotalPrice = document.querySelector('h6#h6TotalPrice');
         const h6DiscountPrice = document.querySelector('h6#h6DiscountPrice');
         const h6PaiedPrice = document.querySelector('h6#h6PaiedPrice');
         const h6ReceivePrice = document.querySelector('h6#h6ReceivePrice');
     
         // 처음설정값 = 0 
         h6TotalPrice.innerHTML=`${data.d_total_price} 원`;
         h6DiscountPrice.innerHTML=`${data.d_discount_price} 원`;
         h6PaiedPrice.innerHTML=`${data.d_receive_price} 원`;
         h6ReceivePrice.innerHTML=`${ ((data.d_total_price-data.d_discount_price)-data.d_receive_price) } 원`;
     };
        
        
     // 착석 탈석 버튼처리
     const btnDeskState = document.querySelector('button#btnDeskState');
     btnDeskState.addEventListener('click', function(){
         
         const inputDeskState = document.querySelector('input#inputDeskState');
         if(inputDeskState.value==1){
            const check = confirm('변경할까요?\n(결제가 있었다면 환불됩니다.)');
            if(!check){
                return;
            }
         }else{
            const check = confirm('좌석에 배치할까요?'); 
            if(!check){
                return;
            }
         }
         
         const reqUrl = `/api/desk/change/state/${deskId}`;
         axios.put(reqUrl)
         .then((response) => {
             // 자리참 변환        
             if(response.data==1){
                 location.reload(true);
             //자리 빔 변환
             }else{
                 
                 // 할인, 받은금액등 초기화
                 const disUrl = `/api/dtable/reset/price/${deskId}`;
                 axios.put(disUrl)
                 .then()
                 .catch();
                 
                 // 모든 주문건 삭제                 
                 const delUrl = `/api/dtable/delete/${deskId}`;
                 axios.delete(delUrl)
                 .then(()=>{
                     // 새로고침
                    location.reload(true);
                 })
                 .catch((erorr)=>{
                     console.log(erorr);
                 });
                 
             }
             // 상태 초기화
          })
          .catch((error) =>{
              console.log(error);
          });
      }); // end 착탈석 버튼처리
     
     // 쿼리 스트링 가져오기
     function searchParam(key) {
        return new URLSearchParams(location.search).get(key);
     };
     
     // destId
     const deskId = searchParam('id');
     
     // 주문내역 리스트 초기화
     const makeOrderListElement = (data) =>{
        
         const tbodyOrderList = document.querySelector('tbody#tbodyOrderList');
         tbodyOrderList.innerHTML='';
         let orders ='';
         
         // 내용이 없을때
        if(data.length==0){
            tbodyOrderList.innerHTML=`
                <tr>
                    <td colspan ="6" class="text-center">
                        <img src="/image/no_contant.png" alc="no_contant" width="400" height="400">
                    </td>
                </tr>
            `;
        }
         
        for(let order of data){
            
            sumPrice = (order.m_price*order.dt_count);
            
            if(order.m_name == '추가금'){
                orders += `
                    <tr data-id="${order.id}" class="trOneOrders">
                        <td data-id="${order.id}" class="table-light text-center">
                            <input data-id="${order.id}" disabled class="menuCheckBoxSelected form-check-input" type="checkbox" id="inputDeskCheck_${order.id}"/>
                        </td>
                        <td colspan="4" data-id="${order.id}" class="table-light">${order.m_name}</td>
                        <td data-id="${order.id}" class="table-light text-right">${sumPrice}</td>
                    </tr>
                `;
            }else{
            orders+=`
                <tr data-id="${order.id}" class="trOneOrders">
                    <td data-id="${order.id}" class="table-light text-center">
                        <input data-id="${order.id}" disabled class="menuCheckBoxSelected form-check-input" type="checkbox" id="inputDeskCheck_${order.id}"/>
                    </td>
                    
                    <td data-id="${order.id}" class="table-light">${order.m_name}</td>
                    <td data-id="${order.id}" class="table-light">${order.m_price}</td>
                    <td data-id="${order.id}" class="table-light">${order.m_category}</td>
                    
                    <td data-id="${order.id}" class="table-light text-center">
                        <button data-id="notApplyMinus" data-oid="${order.id}" class="btnMinusCount btn btn-outline-primary">-</button>
                            <span id="spanOCount" data-id="${order.id}" class="orderCount">${order.dt_count}</span>
                        <button data-id="notApplyPlus" data-oid="${order.id}" class="btnPlusCount btn btn-outline-primary">+</button>
                    </td>
                    
                    <td data-id="${order.id}" class="table-light text-right">${sumPrice}</td>
                    
                </tr>
            `;
         }
         }
         
         tbodyOrderList.innerHTML += orders;
         // 행클릭시 -> 체크박스 변화
         const trOneOrders = document.querySelectorAll('tr.trOneOrders');
         for(let oneOreder of trOneOrders){
             oneOreder.addEventListener('click', function(e){
                const orderId = e.target.getAttribute('data-id');
                
                // 플러스마이너스 버튼 처리
                if(orderId=='notApplyMinus'){
         
                     // 결제내역이 있다면 불가능 처리
                     const h6PaiedPrice = document.querySelector('h6#h6PaiedPrice').innerHTML;
                     if(h6PaiedPrice!='0 원'){
                         alert('분할 결제내역이 있을때는 불가능한 시도입니다.');
                         return;
                     }
                     
                    const oId = e.target.getAttribute('data-oid');
                    const reqUrl = `/api/dtable/minus/${oId}`;
                    
                    axios.put(reqUrl)
                    .then(()=>{
                        // 새로 고침
                        location.reload(true);
                    })
                    .catch((error)=>{
                        console.log(error);
                    })
                    return;
                    
                }else if(orderId=='notApplyPlus'){
                    const oId = e.target.getAttribute('data-oid');
                    const reqUrl = `/api/dtable/plus/${oId}`;
                    
                    axios.put(reqUrl)
                    .then((response)=>{
                        // 플러스버튼 처리
                        // 추가 가능, 성공
                        if(response.data==1){
                            // 새로 고침
                            location.reload(true);
                        // 추가 불가능, 실패
                        }else{
                            alert('(실패)일일 판매가능 갯수 초과 입니다.');
                        }
                    })
                    .catch((error)=>{
                        console.log(error);
                    })
                    return;
                }
                
                const checkBoxsIdStr = `input#inputDeskCheck_${orderId}`;
                const checkBox = document.querySelector(checkBoxsIdStr);
                                
                // 체크상태 아닐때 
                if(checkBox.checked == false){
                    checkBox.setAttribute('checked', true);  
                // 체크상태일 때 
                }else{
                    checkBox.removeAttribute('checked');                                    
                }
             });
         }
     }; // end makeOrderListElement();
         
     
     // 전체선택 버튼 처리 (리버스 처리)
     const selectAllOrDeleteAll = document.querySelector('th#selectAllOrDeleteAll');
     selectAllOrDeleteAll.addEventListener('click', function(){
         const menuCheckBoxSelected = document.querySelectorAll('input.menuCheckBoxSelected');
         for(let selected of menuCheckBoxSelected){
             if(selected.checked == false){
                 selected.setAttribute('checked', true);  
             }else{
                 selected.removeAttribute('checked');                                    
             }
         }
     });
     
     // 선택삭제버튼 처리 TODO 1. 결제내역 있으면 불가능
     const btnSelectOrderDelete = document.querySelector('button#btnSelectOrderDelete');
     btnSelectOrderDelete.addEventListener('click', function(e) {
         
         // 결제내역이 있다면 불가능 처리
         const h6PaiedPrice = document.querySelector('h6#h6PaiedPrice').innerHTML;
         if(h6PaiedPrice!='0 원'){
             alert('분할 결제내역이 있을때는 불가능한 시도입니다.');
             return;
         }
         
         const menuCheckBoxSelected = document.querySelectorAll('input.menuCheckBoxSelected');
         
         // 선택행 배열에 넣기
         let selectedList = new Array;
         for(let seleted of menuCheckBoxSelected){
            if(seleted.checked == true){
                selectedList.push(seleted.id.substr(15));
            }
         }
         
         // 선택없으면 그냥 반환
         if(selectedList.length<=0){
             alert('선택한 행이 없습니다.');
             return;
         }
         
         // 요청주소
         const reqUrl = `/api/dtable/delete/selected/${deskId}`;
         const data = { selectedList, deskId };
         
         console.log(data);
         
         axios.put(reqUrl, data)
         .then(()=>{
             // 주문 테이블 초기화
            location.reload(true);
         })
         .catch((erorr)=>{
             console.log(erorr);
         });
         
     });
     
     
     // 전체삭제버튼 처리
     const btnAllOrderDelete = document.querySelector('button#btnAllOrderDelete');
     btnAllOrderDelete.addEventListener('click', function() {
         
         // 결제내역이 있다면 불가능 처리
         const h6PaiedPrice = document.querySelector('h6#h6PaiedPrice').innerHTML;
         if(h6PaiedPrice!='0 원'){
             alert('분할 결제내역이 있을때는 불가능한 시도입니다.');
             return;
         }
         
         const check = confirm('주문 목록을 전체 삭제 합니까?');
         if(!check){
             return;
         }
         
         const reqUrl = `/api/dtable/delete/${deskId}`;
         
         axios.delete(reqUrl)
         .then(()=>{
             // 주문 테이블 초기화
            location.reload(true);
         })
         .catch((erorr)=>{
             console.log(erorr);
         });
         
         
     });
     
     // 메뉴디테일에서 검색
     const makeMenuListElemants = (data) =>{
         
         const tableMenuList = document.querySelector('tbody#tableMenuList');
         tableMenuList.innerHTML = '';
         let menuList='';
         
         // 내용없을때
         if(data.length==0){
            tableMenuList.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center">
                        <img src="/image/no_contant.png" alc="no_contant" width="200" height="200">
                    </td>
                </tr>
            `;
            return;
         }
         
         for(let menu of data){
             // 남은갯수 포메팅
             let last = menu.m_stock;
             if(menu.m_stock==99999){
                 last='무한'
             }else{
                 last =(last - menu.m_solded)+' 개'
             }
             // 돈 포메팅
             const price = menu.m_price;
             // 남은 재고가 0이면 추가가 안되게 설정
             if(last== '0 개'){
                 
                menuList += `
                <tr>
                    <td><strike>${menu.m_name}</strike></td>
                    <td class="text-center"style="color:red">재고없음</td>
                    <td style="text-align: right;"><strike>${price} 원</strike></td>
                </tr>
                `;
                
             }else{
                menuList += `
                <tr data-id="${menu.id}" class="trMenus">
                    <td data-id="${menu.id}">${menu.m_name}</td>
                    <td data-id="${menu.id}" class="text-center">${last}</td>
                    <td data-id="${menu.id}" style="text-align: right;">${price} 원</td>
                </tr>
                `;
             }
         }
         tableMenuList.innerHTML += menuList;
         
         // 행 클릭 이벤트
         const trOneMenus = document.querySelectorAll('tr.trMenus');
         for(let oneRow of trOneMenus){
             oneRow.addEventListener('click', function(e) {
                 
                 const menuId = e.target.getAttribute('data-id');
                 const reqUrl = `/api/dtable/add/menu/${menuId}`;
                 const data = {menuId, deskId}
                                  
                 axios.put(reqUrl, data)
                 .then((response)=>{
                     // 주문창 초기화
                     makeOrderListElement(response.data)
                     // 테이블 상태 초기화
                     location.reload(true);
                 })
                 .catch((erorr)=>{
                     console.log(erorr);
                 });
                 
             });
         }
                
     }; // end makeMenuListElemants();

      // 주문, x버튼 처리
      const btnGoForceMain = document.querySelectorAll('button.btnGoForceMain');
      for(let btn of btnGoForceMain){
          btn.addEventListener('click', function(){
              const form = document.querySelector('form#formGoForceMain');
              form.submit();
          });
      }      
     
      // 메뉴 카테고리 버튼이 클릭 되었을 때,
      const btnMenuCategory = document.querySelectorAll('button.btnMenuCategory');
      for(let btn of btnMenuCategory){
          btn.addEventListener('click', async function(e) {
              // 검색창 초기화
              document.querySelector('input#inputhMenuSearc').value='';
             
             // 다른 버튼들 css 비활성화
             for(let allBtn of btnMenuCategory){
                allBtn.className = 'btnMenuCategory btn navbar-brand';
             }
            // 버튼의 클래스 css 활성화
             btn.className='btnMenuCategory btn btn-info navbar-brand';
            
             // 어떤버튼인지 정보 가져오기
             const category = e.target.getAttribute('data-id');
             
             // 전체버튼일 경우
             if(category == 'all_menu'){
                 // 전체 수정
                 getAllMenuList();
                 return;
             }
             // 나머지 버튼의 경우
             // 검색창 초기화
            document.querySelector('input#inputhMenuSearc').value='';
            
             const categoryAndDeskId = category+','+deskId;
             const reqUrl = `/api/menu/desk/option/${categoryAndDeskId}`;
             
             try{
                 const response = await axios.get(reqUrl);
                 makeMenuListElemants(response.data);
             }catch(erorr){
                 console.log(erorr);
             }
             
          }); // 
         
      } // end 카테고리 메뉴리스트 
     
     // 검색버튼이 눌렸을때
     const btnMenuSearc = document.querySelector('button#btnMenuSearc');
     btnMenuSearc.addEventListener('click', async function(){
         
         // 카테고리 css 전체 삭제
         for(let catebtn of btnMenuCategory){
            catebtn.className = 'btnMenuCategory btn navbar-brand';
         }
         
         
         const searchWord = document.querySelector('input#inputhMenuSearc').value;
         const searchWordAndDeskKId = searchWord+','+deskId
         const reqUrl = `/api/menu/desk/search/${searchWordAndDeskKId}`;
         
         try{
             const response = await axios.get(reqUrl);
             makeMenuListElemants(response.data);
         }catch(error){
             console.log(error);
         }
         
         // 검색창 초기화
         document.querySelector('input#inputhMenuSearc').value='';
     });
          
     // 페이지 전체 초기화(메뉴전체보기)
     const getAllMenuList = async () =>{
         // 검색창 초기화
         document.querySelector('input#inputhMenuSearc').value='';
         
         reqUrl =`/api/menu/desk/all/${deskId}`;

         try{
             const response = await axios.get(reqUrl);
             makeMenuListElemants(response.data); 
         }catch(erorr){
             console.log(erorr);
         }
         
     }; // end getAllMenuList()
     
     const getAllOrderListByDeskId = async () =>{
         
         const reqUrl = `/api/dtable/readAll/${deskId}`;
         
         try{
             const response = await axios.get(reqUrl)
             makeOrderListElement(response.data);
         }catch(error){
             console.log(error);
         }
     }; // end getAllOrderListByDeskId();
     
          
     // 페이지 전체 초기화(메뉴전체보기)
     const getDeskPrice = async () =>{
         // 검색창 초기화
                  
         reqUrl =`/api/desk/price/reset/${deskId}`;

         try{
             const response = await axios.get(reqUrl);
             MakePriceElement(response.data); 
         }catch(erorr){
             console.log(erorr);
         }
         
     }; // end getAllMenuList()
     
     
     // 페이지 열릴때 수행
     getAllMenuList();
     getAllOrderListByDeskId();
     getDeskPrice();
 });