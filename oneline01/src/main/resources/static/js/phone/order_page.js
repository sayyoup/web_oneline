/**
 * order_page.js : 주문내역 페이지
 */
document.addEventListener('DOMContentLoaded', function(){
    
     // cid
     const inputCId = document.querySelector('input#inputCId');
     const cId = inputCId.value;
    
     // 로고처리
     const h6Logo = document.querySelector('h6#h6Logo');
     h6Logo.addEventListener('click',function(){
         // 페이지 이동처리
         const url =`/line/check_line?c_id=${cId}`;
         location.href = url;
     }); 
    
     // 총금액
     const spanTotalPrice = document.querySelector('span#spanTotalPrice');
    
     // 테이블
     const tbodyOrderList = document.querySelector('tbody#tbodyOrderList');
        
     // 테이블 요소 체우기
     const makeElemnt = (data) =>{
         
         tbodyOrderList.innerHTML = '';
         spanTotalPrice.innerHTML='';
         // 빈값
         if(data == ''){
             tbodyOrderList.innerHTML += `
                 <tr class="text-center">
                     <td colspan="4">
                         <img src="/image/no_contant.png" alt="no" style=width:300px ; height:300px;">
                     <td>
                 </tr>
             `;
             spanTotalPrice.innerHTML = 0;
             return;
         }
         
         let totalPrice = 0;
         let menuList ='';
         for(let menu of data){
            
             totalPrice += menu.m_price;
             // 글자크기 
             let name = menu.m_name;
             if(menu.m_name.length >= 11){
                 name = name.substr(0, 9)+'...';
             }
             
             //사진 처리
             let pic = menu.m_pic;
             if(menu.m_pic==null){
                 pic = '/image/menu_image_ready.png';
             }
           
             menuList +=`
                 <tr data-id="${menu.dt_id}" class="trModalToggle">
                     <td style="text-align:left;" data-id="${menu.dt_id}">
                         <div style="background: teal; width:80px ; height:80px;">
                             <img data-id="${menu.dt_id}" src="${pic}" alt="menuImage" style="background: teal; width:80px ; height:80px;"/>
                         </div>
                     </td>                            
                     <td style="text-align:left;" data-id="${menu.dt_id}">
                         <font size=2 data-id="${menu.dt_id}">${name}</font>
                     </td>
                     <td data-id="${menu.dt_id}">${menu.b_count}</td>
                     <td style="text-align:right;" data-id="${menu.dt_id}">${menu.m_price}원</td>
                 </tr>
             `;
        }
       
        tbodyOrderList.innerHTML += menuList;
        spanTotalPrice.innerHTML += totalPrice;
        
        // 모달처리
        const trModalToggle = document.querySelectorAll('tr.trModalToggle');
        for(let mo of trModalToggle){
            mo.addEventListener('click', function(e){
                
                const check = confirm('해당 주문을 취소할까요?');
                if(!check){
                    return;
                }
                const dtId = e.target.getAttribute('data-id');
                const delUrl = `/api/customer/delete/order/${dtId}`;
                
                axios.delete(delUrl)
                .then(()=>{
                    alert('취소되었습니다.');
                    pageFormat();
                })
                .catch((error)=>{
                    console.log(error);
                });
                
            });
        }
        
    };
   
    const pageFormat = async ()=>{
       
        const reqUrl = `/api/customer/read/all/order/${cId}`;
        try{
            const response = await axios.get(reqUrl);
            makeElemnt(response.data);
        }catch(error){
            console.log(error);
        }       
    };
    
    const btnGoHoe = document.querySelector('button#btnGoHoe');
    const btnaddBasket = document.querySelector('button#btnaddBasket');
    
    btnGoHoe.addEventListener('click', function(){
         // 페이지 이동처리
         const url =`/line/check_line?c_id=${cId}`;
         location.href = url;
    });
    btnaddBasket.addEventListener('click', function(){
         // 페이지 이동처리
         const url =`/menu/menu_list?c_id=${cId}`;
         location.href = url;
    });
    
    pageFormat();
});