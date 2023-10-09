/**
 * force_main_line.js : 줄서기 테이블 리스트 불러오기
 */
 document.addEventListener('DOMContentLoaded', function(){
      
     const inputStoreId = document.querySelector('input#inputStoreId');
     const storeId = inputStoreId.value;

    // 주문내역 모달 내용 체우기
    const makeOrderListElemant = (data) =>{
        
        console.log(data);
        
        const tbodyBasketList =document.querySelector('tbody#tbodyBasketList');
        const fontTotalPrice =document.querySelector('font#fontTotalPrice');
        
        tbodyBasketList.innerHTML='';
        fontTotalPrice.innerHTML='';
        
        let ordList = '';
        let totalprice =0;
        
        for(let ord of data){
            totalprice+= parseInt(ord.m_price);
            ordList += `
                <tr>
                    <td style="text-align:left;">${ord.m_name}</td>
                    <td style="text-align:center;">${ord.b_count} 개</td>
                    <td style="text-align:right;">${ord.m_price} 원</td>
                </tr>
            `;
        }
        tbodyBasketList.innerHTML += ordList;
        fontTotalPrice.innerHTML+=totalprice;
    };


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
             if(desk.d_state == 1){
                 card_color =` text-bg-info`;
             }else{
                 card_color =` text-bg-danger`;
             }
             
             // 담겨있는 메뉴
             let card_text = '';
             if (desk.menus.length >= 4){
                 card_text=`
                    <p class="card-text fs-6">
                        ${desk.menus[0]}
                    </p>
                    <p class="card-text fs-6">
                        ${desk.menus[1]}
                    </p>
                    <p class="card-text fs-6">
                        ${desk.menus[2]}
                    </p>
                    <p class="card-text fs-6">
                        ...
                    </p>
                    `;
             }else if(desk.menus.length == 3){
                 card_text=`
                    <p class="card-text fs-6">
                        ${desk.menus[0]}
                    </p>
                    <p class="card-text fs-6">
                        ${desk.menus[1]}
                    </p>
                    <p class="card-text fs-6">
                        ${desk.menus[2]}
                    </p>
                    `;
             }else if(desk.menus.length == 2){
                 card_text=`
                    <p class="card-text fs-6">
                        ${desk.menus[0]}
                    </p>
                    <p class="card-text fs-6">
                        ${desk.menus[1]}
                    </p>
                    `;
             }else if(desk.menus.length == 1){
                 card_text=`
                    <p class="card-text fs-6">
                        ${desk.menus[0]}
                    </p>
                    `;
             }else if(desk.menus.length == 0){
                 card_text=`
                    <p class="fs-6 card-text">
                        주문이 없습니다.
                    </p>
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
    
    // 배치하는 모달내용 체우기
    const setArrangementModal = (data, lineId) =>{
        
        const tbodyCustomerArrangementModal = document.querySelector('tbody#tbodyCustomerArrangementModal');
        tbodyCustomerArrangementModal.innerHTML='';
        let desks='';
        
        if(!data.length){
            tbodyCustomerArrangementModal.innerHTML=`
                <tr>
                    <td class="text-center" colspan="3">
                        <img src="/image/no_contant.png" alc="no_contant">
                    </td>
                </tr>
            `;
            return;
        }
        
        for(desk of data){
            desks+=`
                <tr>
                    <td> ${desk.d_number} 번 테이블</td>
                    <td class="text-center"> ${desk.d_count} 명</td>
                    <td class="text-center">
                        <button class="btnArrangement btn btn-outline-success" data-bs-dismiss="modal" data-id="${desk.id}">배치</button>
                    </td>
                </tr>
            `;
        }
        tbodyCustomerArrangementModal.innerHTML +=desks;
        
        // 모달속 배치버튼처리
        const btnArrangements =document.querySelectorAll('button.btnArrangement');
            for(let btnAmt of btnArrangements){
                btnAmt.addEventListener('click', function(e){
                    
                    const deskId = e.target.getAttribute('data-id');
                    const reqUrl = `/api/desk/sitdown/${deskId}`;
                    
                    const data={deskId, lineId}
                    
                    axios.put(reqUrl, data)
                    .then((response)=>{
                        makeDeskElements(response.data);
                        
                        // 새로 고침
                        location.reload(true);;
                    })
                    .catch((erorr)=>{
                        console.log(erorr);
                    });

                });
            }
    };
    
    
    // 줄 요소 체우기    
    const makeLineElements = (data) => {
        const lineListtable = document.querySelector('tbody#lineListtable');
        lineListtable.innerHTML = '';
        let liens = '';
        
        // 리스트내용 없으면
        if(!data.length){
            lineListtable.innerHTML = `
                <tr>
                    <td class="text-center" colspan="4">
                        <img src="/image/no_contant.png" alc="no_contant">
                    </td>
                </tr>
            `;
            return;
        }
        
        for(line of data){
            // 주문 상테
            state =' (X)';
            // 주문한 상테
            if(line.c_state){
                state = ' (O)';

                liens +=`
                <tr>
                    <td class="orderIn" data-tdid="${line.id}" data-bs-toggle="modal" data-bs-target="#orderModal">${line.c_number}</td>
                    <td class="orderIn" data-tdid="${line.id}" data-bs-toggle="modal" data-bs-target="#orderModal">${line.c_name} ${state}</td>
                    <td class="orderIn text-center" data-tdid="${line.id}" data-bs-toggle="modal" data-bs-target="#orderModal">${line.c_count}</td>
                    
                    <td style="text-align:right;">
                        <button class="btnPutIn btn btn-outline-success" data-number="${line.c_number}" data-id="${line.id}" data-bs-toggle="modal" data-bs-target="#customerArrangementModal">배치</button>
                    </td>
                    <td><button class="btnDelete btn btn-outline-danger" data-id="${line.id}">삭제</button></td>
                </tr>
                `;
            // 안한상태
            }else{
                liens +=`
                <tr>
                    <td>${line.c_number}</td>
                    <td>${line.c_name} ${state}</td>
                    <td class="text-center">${line.c_count}</td>
                    <td style="text-align:right;"><button class="btnPutIn btn btn-outline-success" data-number="${line.c_number}" data-id="${line.id}" data-bs-toggle="modal" data-bs-target="#customerArrangementModal">배치</button></td>
                    <td><button class="btnDelete btn btn-outline-danger" data-id="${line.id}">삭제</button></td>
                </tr>
                `;
            }
            
            
        }        
        lineListtable.innerHTML += liens;
        
        // 주문한 손님 클릭시 체울 모달내용
        const orderIn = document.querySelectorAll('td.orderIn');
        
        for(let order of orderIn){
            order.addEventListener('click', async function(e){
                
                const tdid = e.target.getAttribute('data-tdid');
                const ordUrl = `/api/customer/read/one/order/${tdid}`;
                // 검색후 모달 체우기
                try{
                    const response = await axios.get(ordUrl);
                    makeOrderListElemant(response.data);
                    
                }catch(error){
                    console.log(error);
                }
            });
        }
        
        // 배치모달 보이기
        const btnPutIns = document.querySelectorAll('button.btnPutIn');
        for(let btnPut of btnPutIns){
            btnPut.addEventListener('click', async function(e){
                                
                const lineId = e.target.getAttribute('data-id');
                const number = e.target.getAttribute('data-number');
                document.querySelector('span#cuntomerNumberArrangement').innerHTML = number;
                const reqUrl=`/api/desk/arrangement/${lineId}`;

                try{
                    const response = await axios.get(reqUrl);
                    setArrangementModal(response.data, lineId);
                }catch(erorr){
                    console.log(erorr);
                }
            });
        }
        // 삭제 버튼 처리
        const btnDeletes = document.querySelectorAll('button.btnDelete');
        for(let btnDel of btnDeletes){
            btnDel.addEventListener('click', function(e){
                // 확인
                const check = confirm('정말 삭제할까요?');
                if(!check){
                    return
                }
                
                const id = e.target.getAttribute('data-id');
                const reqUrl = `/api/line/delete/${id}`;
                
                axios.delete(reqUrl)
                .then(() => {
                    getLineList();
                })
                .catch((erorr) =>{
                    console.log(erorr);
                });
            });
        }
    };
    
    // 줄목록 전체 가져오기
    const getLineList = async () => {
        const reqUrl = `/api/line/all/${storeId}`;
        
        try{
            const response = await axios.get(reqUrl);
            makeLineElements(response.data);
        }catch(erorr){
            console.log(erorr)
        }
    };
    
    
    const btnLineUpdate = document.querySelector('button#btnLineUpdate');
    btnLineUpdate.addEventListener('click',function(){
        getLineList();
    });
        
        // 페이지 열릴때
        getLineList();

});