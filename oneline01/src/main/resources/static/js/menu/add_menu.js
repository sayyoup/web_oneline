/**
 * add_manu.js : 1. 내용확인
 */
document.addEventListener('DOMContentLoaded', function(){
    
    const btnAddMenu = document.querySelector('button#btnAddMenu');
    const formAdd = document.querySelector('form#formAdd');
    
    btnAddMenu.addEventListener('click', function(){
        
        // 카테고리 확인
        const selectCategory = document.querySelector('select#selectCategory').value;
        if(selectCategory=='카테고리를 골라주세요'){
            alert('카테고리를 선택후 다시시도해주세요');
            return;
        }
        
        // 금액 확인
        const m_stock = document.querySelector('input#m_stock');
        if(m_price.length >= 6 && m_price.length <= 0){
            alert('제대로된 금액을 입력해 주세요');
            return;
        }
        
        formAdd.submit();
        
    });
    
});
 