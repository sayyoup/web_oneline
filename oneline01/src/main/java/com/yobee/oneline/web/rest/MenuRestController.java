package com.yobee.oneline.web.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yobee.oneline.dto.menu.MenuReadDto;
import com.yobee.oneline.repository.store.Store;
import com.yobee.oneline.service.MenuService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuRestController {

	private final MenuService menuService;
	
	// 전체목록 가져오기(상점아이디)
	@GetMapping("/all/{storeId}")
	public ResponseEntity<List<MenuReadDto>> readAllMenuList(@PathVariable Long storeId, HttpSession session){
		SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");
		Store s = (Store) securityContext.getAuthentication().getPrincipal();
		log.info("전체 읽기 storeId = {}", s.getId());
		List<MenuReadDto> menus = menuService.readMenuByStoreId(s.getId());
		return ResponseEntity.ok(menus);
	}
	// 처음 전체보기
	@GetMapping("/desk/all/{deskId}")
	public ResponseEntity<List<MenuReadDto>> readAllMenuListByDeskId(@PathVariable Long deskId){
		log.info("전체 읽기 deskId = {}", deskId);
		List<MenuReadDto> menus = menuService.readMenuByDeskId(deskId);
		return ResponseEntity.ok(menus);
	}
	
	// 카테고리로 메뉴 검색
	@GetMapping("/desk/option/{categoyAndDeskId}")
	public ResponseEntity<List<MenuReadDto>> readOptionMenuListBycategory(@PathVariable String categoyAndDeskId) {
		log.info("category = {}", categoyAndDeskId);
		String[] cateAndDId = categoyAndDeskId.split(",");
		
		List<MenuReadDto> menus = menuService.readMenuByCategoryWithId(cateAndDId[0], Long.parseLong(cateAndDId[1]));
		return ResponseEntity.ok(menus);
	}
	
	// 검색내용으로 메뉴 검색
	@GetMapping("/desk/search/{searchWordAndDeskKId}")
	public ResponseEntity<List<MenuReadDto>> readMenuBySearch(@PathVariable String searchWordAndDeskKId){
		String[] searchAndDeskId = searchWordAndDeskKId.split(",");
		
		List<MenuReadDto> menus = menuService.readMebuByNameIsKeyword(searchAndDeskId[0], Long.parseLong(searchAndDeskId[1]));
		return ResponseEntity.ok(menus);
	}
	
	// 메뉴 삭제하기
	@DeleteMapping("/delete/{menuId}")
	public void deleteMenuById(@PathVariable Long menuId) {
		menuService.deleteById(menuId);
	}
	
	// 사용자에게 메뉴 하나객체 전달
	@GetMapping("/view/detail/{menuId}")
	public ResponseEntity<MenuReadDto> takeAMenu(@PathVariable Long menuId){
		MenuReadDto dto = menuService.findDetail(menuId);
		return ResponseEntity.ok(dto);
	}
	
	
}
