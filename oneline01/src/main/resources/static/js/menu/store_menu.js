/**
 * store_menu.js
 */

document.addEventListener('DOMContentLoaded', function(){
     
     const StoreId = 0;
     // 페이지 열렸을때 테이블 초기화
    
    
    
    // tbody 안에 리스트 체우기
    const makeMenuElemnts = (data) => {
        //  (체울 곳)    
        const menuListTableBody = document.querySelector('tbody#menuListTableBody');
        menuListTableBody.innerHTML='';
        let menus ='';
        if(data.length == 0){
            menuListTableBody.innerHTML=`
                <tr class="text-center">
                    <td colspan="6" style="background-color: transparent;">
                        <img src='/image/no_contant.png' alt='no_contant'>            
                    </td>
                </tr>
            `;
            return
        }
        // 체울내용
        for(menu of data){
                        
            let stock = menu.m_stock;
            let live = 0;
            if(menu.m_stock==99999){
                stock='제한없음'
                live='제한없음'
            }else{
                live = menu.m_stock - menu.m_solded;
            }
            
            menus += `
            <tr>
                <td>${menu.m_name}</td>
                <td>${menu.m_price}</td>
                <td>${menu.m_category}</td>
                <td>${stock}</td>
                <td>${live}</td>
                <td style="text-align:right">
                    <form method="post" action="/store/store_modify_menu">
                        <input type="hidden" name="id" value="${menu.id}"/>
                        <button type="submit" class="btnModify btn btn-outline-success">수정</button>
                    </form>
                </td>
                <td>
                    <button class="btnDelete btn btn-outline-danger" data-id="${menu.id}">삭제</button>
                </td>
            </tr>
            `
        }
        menuListTableBody.innerHTML += menus;
        
        //삭제버튼
        const btnDelete = document.querySelectorAll('button.btnDelete');
        for(let btn of btnDelete){
            btn.addEventListener('click', function(e){
                const check = confirm('정말 삭제할까요?');
                if(check==0){
                    return;
                }                
                const menuId = e.target.getAttribute('data-id');
                const reqUrl = `/api/menu/delete/${menuId}`;
                axios.delete(reqUrl)
                .then(() =>{
                    // 성공이후 초기화
                    getAllMenuList();
                })
                .catch((erorr) =>{
                    console.log(erorr);
                });
                
            });
        }
    }
    
    
    const getAllMenuList = async () =>{
        const reqUrl = `/api/menu/all/${StoreId}`;
        try{
            const response = await axios.get(reqUrl);
            makeMenuElemnts(response.data);
        }catch(erorr){
            console.log(erorr);
        }
    };
    
    getAllMenuList();
});