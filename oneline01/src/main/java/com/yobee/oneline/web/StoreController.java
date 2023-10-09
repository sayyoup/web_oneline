package com.yobee.oneline.web;


import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yobee.oneline.dto.menu.MenuCreateDto;
import com.yobee.oneline.dto.menu.MenuUpdatedDto;
import com.yobee.oneline.repository.store.Store;
import com.yobee.oneline.service.MenuService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/store")
public class StoreController {
	
	private final MenuService menuService;
	
	// 상품 관리페이지 열기
	@GetMapping("/store_menu")
	public void  store_menu_page() {		
		log.info("store_menu_page : 메뉴 관리페이지");
	}
	
	// 상품추가
	@GetMapping("/store_add_menu")
	public void add_menu_page() {
		log.info("add_menu_page (상품 등록 페이지)");
	}
	
	@PostMapping("store_add_menu") 
	public String add_menu(MenuCreateDto dto, HttpSession session) {
		SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");
		Store s = (Store) securityContext.getAuthentication().getPrincipal();
		dto.setStoreId(s.getId());
		log.info("dto = {}", dto.toString());
		menuService.createMenu(dto);
		
		
		log.info("(상품 추가 성공)");
		return "redirect:/store/store_menu";
	}
	
	// 상품 수정
	@PostMapping("/store_modify_menu")
	public void store_modify_menu1(Model model, Long id) {
		log.info("메뉴 수정 페이지 id = {}",id);
		MenuUpdatedDto menu = menuService.findByMenuId(id);
		model.addAttribute("menu",menu);
	}
	
	// 수정완료
	@PostMapping("/update_menu")
	public String store_update_menu(MenuUpdatedDto dto) {
		log.info("메뉴 수정 dto={}", dto);
		menuService.updateByEntity(dto);
		log.info("메뉴 수정완료");
		return "redirect:/store/store_menu";
	}
	
}
