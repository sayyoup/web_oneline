/**
 * force_main.js : desk 테이블 관리 추가 삭제 버튼처리
 */

 document.addEventListener('DOMContentLoaded', function(){
      
     const inputStoreId = document.querySelector('input#inputStoreId');
     const storeId = inputStoreId.value;
     
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
     
     const btnAddDestk = document.querySelector('button#btnAddDestk');
     const btnRemoveDestk = document.querySelector('button#btnRemoveDestk');

     // 데스크 리스트 만들어 출력
     const makeDeskElements = (data) =>{
         
         const divDeskList = document.querySelector('div#divDeskList');
         
         divDeskList.innerHTML = '';
         let desks = '';
         // data에 값 없을때
         if(!data.length){
             divDeskList.innerHTML = `
                 <div class="col">
                 </div>
                 <div class="col">
                 </div>
                 <div class="col">
                     <img src="/image/no_contant.png" alc="no_contant">
                 </div>
                 <div class="col">
                 </div>
                 <div class="col">
                 </div>
             `;
             return;
         }
         
         for(let desk of data){
             
             // 카드색상
             card_color ='';
             if(desk.d_state ==1){
                 card_color =` text-bg-info`;
             }else{
                 card_color =` text-bg-danger`;
             }
             
             // 담겨있는 메뉴
             let card_text = '';
             if (desk.menus.length >= 6){
                 
                 let ostr = desk.menus[0].slice(0, -4);
                 if(ostr.length >= 12){
                     ostr = desk.menus[0].slice(0, 9) + '...';
                 }
                 
                 let tstr = desk.menus[1].slice(0, -4);
                 if(tstr.length >= 12){
                     tstr = desk.menus[1].slice(0, 9) + '...';
                 }
                 
                 let thstr = desk.menus[2].slice(0, -4);
                 if(thstr.length >= 12){
                     thstr = desk.menus[2].slice(0, 9) + '...';
                 }
                 
                 let fstr = desk.menus[3].slice(0, -4);
                 if(fstr.length >= 12){
                     fstr = desk.menus[3].slice(0, 9) + '...';
                 }
                 
                 let fistr = desk.menus[4].slice(0, -4);
                 if(fistr.length >= 12){
                     fistr = desk.menus[4].slice(0, 9) + '...';
                 }
                 
                 card_text=`
                    <font>
                        ${ostr}
                    </font>
                    <font >
                        ${desk.menus[0].slice(-3,)}
                    </font>
                    <br/>
                    <font>
                        ${tstr}
                    </font>
                    <font >
                        ${desk.menus[1].slice(-3,)}
                    </font>
                    <br/>
                    <font>
                        ${thstr}
                    </font>
                    <font >
                        ${desk.menus[2].slice(-3,)}
                    </font>
                    <br/>
                    <font>
                        ${fstr}
                    </font>
                    <font >
                        ${desk.menus[3].slice(-3,)}
                    </font>
                    <br/>
                    <font>
                        ${fistr}
                    </font>
                    <font >
                        ${desk.menus[4].slice(-3,)}
                    </font>
                    <br/>
                    <font>
                        ....
                    </font>
                    
                 `;
             }else if (desk.menus.length == 5){
                 
                 let ostr = desk.menus[0].slice(0, -4);
                 if(ostr.length >= 12){
                     ostr = desk.menus[0].slice(0, 9) + '...';
                 }
                 
                 let tstr = desk.menus[1].slice(0, -4);
                 if(tstr.length >= 12){
                     tstr = desk.menus[1].slice(0, 9) + '...';
                 }
                 
                 let thstr = desk.menus[2].slice(0, -4);
                 if(thstr.length >= 12){
                     thstr = desk.menus[2].slice(0, 9) + '...';
                 }
                 
                 let fstr = desk.menus[3].slice(0, -4);
                 if(fstr.length >= 12){
                     fstr = desk.menus[3].slice(0, 9) + '...';
                 }
                 
                 let fistr = desk.menus[4].slice(0, -4);
                 if(fistr.length >= 12){
                     fistr = desk.menus[4].slice(0, 9) + '...';
                 }
                 
                 card_text=`
                    <font>
                        ${ostr}
                    </font>
                    <font >
                        ${desk.menus[0].slice(-3,)}
                    </font>
                    <br/>
                    <font>
                        ${tstr}
                    </font>
                    <font >
                        ${desk.menus[1].slice(-3,)}
                    </font>
                    <br/>
                    <font>
                        ${thstr}
                    </font>
                    <font >
                        ${desk.menus[2].slice(-3,)}
                    </font>
                    <br/>
                    <font>
                        ${fstr}
                    </font>
                    <font >
                        ${desk.menus[3].slice(-3,)}
                    </font>
                    <br/>
                    <font>
                        ${fistr}
                    </font>
                    <font >
                        ${desk.menus[4].slice(-3,)}
                    </font>
                 `;
             }else if (desk.menus.length == 4){
                 
                 let ostr = desk.menus[0].slice(0, -4);
                 if(ostr.length >= 12){
                     ostr = desk.menus[0].slice(0, 9) + '...';
                 }
                 
                 let tstr = desk.menus[1].slice(0, -4);
                 if(tstr.length >= 12){
                     tstr = desk.menus[1].slice(0, 9) + '...';
                 }
                 
                 let thstr = desk.menus[2].slice(0, -4);
                 if(thstr.length >= 12){
                     thstr = desk.menus[2].slice(0, 9) + '...';
                 }
                 
                 let fstr = desk.menus[3].slice(0, -4);
                 if(fstr.length >= 12){
                     fstr = desk.menus[3].slice(0, 9) + '...';
                 }
                 
                 card_text=`
                    <font>
                        ${ostr}
                    </font>
                    <font >
                        ${desk.menus[0].slice(-3,)}
                    </font>
                    <br/>
                    <font>
                        ${tstr}
                    </font>
                    <font >
                        ${desk.menus[1].slice(-3,)}
                    </font>
                    <br/>
                    <font>
                        ${thstr}
                    </font>
                    <font >
                        ${desk.menus[2].slice(-3,)}
                    </font>
                    <br/>
                    <font>
                        ${fstr}
                    </font>
                    <font >
                        ${desk.menus[3].slice(-3,)}
                    </font>
                    `;
             }else if(desk.menus.length == 3){
                 
                 let ostr = desk.menus[0].slice(0, -4);
                 if(ostr.length >= 12){
                     ostr = desk.menus[0].slice(0, 9) + '...';
                 }
                 
                 let tstr = desk.menus[1].slice(0, -4);
                 if(tstr.length >= 12){
                     tstr = desk.menus[1].slice(0, 9) + '...';
                 }
                 
                 let thstr = desk.menus[2].slice(0, -4);
                 if(thstr.length >= 12){
                     thstr = desk.menus[2].slice(0, 9) + '...';
                 }
                 
                 card_text=`
                    <font>
                        ${ostr}
                    </font>
                    <font >
                        ${desk.menus[0].slice(-3,)}
                    </font>
                    <br/>
                    <font>
                        ${tstr}
                    </font>
                    <font >
                        ${desk.menus[1].slice(-3,)}
                    </font>
                    <br/>
                    <font>
                        ${thstr}
                    </font>
                    <font >
                        ${desk.menus[2].slice(-3,)}
                    </font>
                    `;
             }else if(desk.menus.length == 2){
                 
                 let ostr = desk.menus[0].slice(0, -4);
                 if(ostr.length >= 12){
                     ostr = desk.menus[0].slice(0, 9) + '...';
                 }
                 
                 let tstr = desk.menus[1].slice(0, -4);
                 if(tstr.length >= 12){
                     tstr = desk.menus[1].slice(0, 9) + '...';
                 }
                 
                 card_text=`
                    <font>
                        ${ostr}
                    </font>
                    <font >
                        ${desk.menus[0].slice(-3,)}
                    </font>
                    <br/>
                    <font>
                        ${tstr}
                    </font>
                    <font >
                        ${desk.menus[1].slice(-3,)}
                    </font>
                 `;
             }else if(desk.menus.length == 1){
                 
                 let ostr = desk.menus[0].slice(0, -4);
                 if(ostr.length >= 12){
                     ostr = desk.menus[0].slice(0, 9) + '...';
                 }
                 
                 card_text=`
                    <font>
                        ${ostr}
                    </font>
                    <font >
                        ${desk.menus[0].slice(-3,)}
                    </font>
                    `;
             }else if(desk.menus.length == 0){
                 card_text=`
                    <font>
                        주문이 없습니다.
                    </font>
                    `;
             }
             
             // 카드내용
             desks +=`
                    <div class="col">
                        <div class="card${card_color}" style="width: 12rem; height: 15rem;" onClick="location.href='/force/force_desk_detail?id=${desk.id}'">
                            <div class="card-body">
                                <h5 class="card-title">${desk.d_number}번 테이블(${desk.d_count})</h5>
                                ${card_text}
                            </div>
                            <div class="card-footer p-1">
                                <h6 class="card-text">총 금액: ${desk.d_total_price}\<span> 원</span></h6>
                            </div>
                        </div>
                    </div>
                    `;
         }
         
         divDeskList.innerHTML += desks;
         
     };
     
     // 데스크 리스트 목록 가져오기
    const getAllDeskBystoreId = async () => {
         
        const reqUrl = `/api/desk/all/${storeId}`;
         
        try{
            const response = await axios.get(reqUrl);
            makeDeskElements(response.data);
        }catch(error){
            console.log(error);
        }
         
     };
     
     btnAddDestk.addEventListener('click', function(){
         
        // 0.체크
        const inputNewDeskCount = document.querySelector('input#inputNewDeskCount'); 
        if(inputNewDeskCount.value >= 11 || inputNewDeskCount.value <= 0){
            alert('테이블 설정 가능 범위 초과\n(1~10 까지 가능)');
            return;
        }
        
        const count = inputNewDeskCount.value
        // 1. desk 테이블 하나 추가
        const data = {storeId, count};        
        const reqUrl = `/api/desk/create`;
        
        
        axios.post(reqUrl, data)
        .then((response)=>{
            // 2. 보여지는거 초기화
            makeDeskElements(response.data);
            inputNewDeskCount.innerHTML='';
        })
        .catch((error)=>{
            console.log(error);
        });
            
     });
     
     btnRemoveDestk.addEventListener('click', function(){
         
        // 0. 체크
        const check = confirm('정말 삭제하시겠습니까?\n(해당 테이블에 주문내역도 전부 삭제됩니다.)')
        if(!check){
            return;
        }
        
        const reqUrl = `/api/desk/delete/${storeId}`;
        
        axios.delete(reqUrl)
        .then(() =>{
            // 초기화            
            getAllDeskBystoreId();
            alert('삭제완료');
            
        })
        .catch((error)=>{
            console.log(error);
        });

     });
     
     // 페이지 처음 열릴때
     getAllDeskBystoreId();
 });