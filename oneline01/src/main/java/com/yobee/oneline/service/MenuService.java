package com.yobee.oneline.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yobee.oneline.repository.store.Store;
import com.yobee.oneline.repository.store.StoreRepository;
import com.yobee.oneline.dto.menu.MenuCreateDto;
import com.yobee.oneline.dto.menu.MenuReadDto;
import com.yobee.oneline.dto.menu.MenuUpdatedDto;
import com.yobee.oneline.repository.customer.Customer;
import com.yobee.oneline.repository.customer.CustomerRepository;
import com.yobee.oneline.repository.desk.Desk;
import com.yobee.oneline.repository.desk.DeskRepository;
import com.yobee.oneline.repository.menu.Menu;
import com.yobee.oneline.repository.menu.MenuRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class MenuService {
	
	private final MenuRepository menuRepository;
	private final StoreRepository storeRepository;
	private final DeskRepository deskRepository;
	private final CustomerRepository customerRepository;
	
	//상품 생성
	@Transactional
	public void createMenu(MenuCreateDto dto) {
		log.info("상품생성");
		Menu m = dto.toEntity();
		log.info("1");
		Store s = storeRepository.findById(dto.getStoreId()).orElseThrow();
		log.info("2");
		m.setStore(s);	
		log.info("3");
		menuRepository.save(m);
		log.info("4");
	}

	//상품리스트 불러오기
	@Transactional(readOnly = true)
	public List<MenuReadDto> readMenuByStoreId(Long storeId) {
		Store s = storeRepository.findById(storeId).orElseThrow();
		return readMenuByStore(s);
	}
	public List<MenuReadDto> readMenuByStore(Store store){
		List<Menu> menuList =  menuRepository.findByStoreOrderById(store);
		List<MenuReadDto> dtoList = new ArrayList<>();
		for(Menu m : menuList) {
			if(m.getM_name().equals("추가금")) {
				continue;
			}
			MenuReadDto mrd = MenuReadDto.builder().id(m.getId()).m_category(m.getM_category()).m_pic(m.getM_pic())
			.m_name(m.getM_name()).m_price(m.getM_price()).m_stock(m.getM_stock()).m_des(m.getM_description())
			.m_solded(m.getM_solded()).build();
			dtoList.add(mrd);
		}
		return dtoList;
	}

	// 업데이트창 띄우기
	public MenuUpdatedDto findByMenuId(Long id) {
		Menu m = menuRepository.findById(id).orElseThrow();
		return MenuUpdatedDto.builder().m_pic(m.getM_pic())
				.id(m.getId()).m_description(m.getM_description())
				.m_category(m.getM_category()).m_name(m.getM_name()).m_price(m.getM_price())
				.m_stock(m.getM_stock()).build();
	}
	//상품 업데이트
	@Transactional
	public void updateByEntity(MenuUpdatedDto dto) {
		Menu m = menuRepository.findById(dto.getId()).orElseThrow();
		m.upadteWithUpdateDto(dto);
	}

	// 상품삭제
	public void deleteById(Long menuId) {
		Menu m = menuRepository.findById(menuId).orElseThrow();
		menuRepository.delete(m);
	}

	// 메뉴 디테일페이지 상품리스트 보이기
	public List<MenuReadDto> readMenuByDeskId(Long deskId) {
		Desk d = deskRepository.findById(deskId).orElseThrow();
		return readMenuByStore(d.getStore());
	}

	// 카테고리별 메뉴 검색
	public List<MenuReadDto> readMenuByCategoryWithId(String category, long deskId) {

		// 카테고리의 내용확인
		String cate = "";
		if(category.equals("main_menu")) {
			cate = "메인메뉴";
		}else if(category.equals("side_menu")) {
			cate = "사이드메뉴";
		}else if(category.equals("set_menu")) {
			cate = "세트메뉴";
		}else {
			cate = "음료/주류";
		}
		
		// 매장에 해당하는 리스트 보이기
		List<MenuReadDto> allList = readMenuByDeskId(deskId);
		
		// 같은 카테고리만 저장
		List<MenuReadDto> resulList = new ArrayList<>();
		for(MenuReadDto d : allList) {
			if(d.getM_category().equals(cate)) {
				resulList.add(d);
			}
		}
		return resulList;
	}

	// 검색어로 메뉴 찾기
	public List<MenuReadDto> readMebuByNameIsKeyword(String searchWord, long deskId) {

		// 전체 리스트
		List<MenuReadDto> allList = readMenuByDeskId(deskId);

		// 검색어 내용에 포함되는 것만 저장
		List<MenuReadDto> resulList = new ArrayList<>();
		for(MenuReadDto d : allList) {
			if(d.getM_name().contains(searchWord)) {
				resulList.add(d);			}
		}
		
		return resulList;
	}

	// 손님입장에서 메뉴 전체 반환
	@Transactional(readOnly = true)
	public List<MenuReadDto> findByCustomerId(Long customerId) {
		Customer c = customerRepository.findById(customerId).orElseThrow();
		List<MenuReadDto> dList = readMenuByStoreId(c.getStore().getId());
		return dList;
	}
	
	// 손님입장 메뉴 자세히보기
	@Transactional(readOnly = true)
	public MenuReadDto findDetail(long menuId) {
		
		Menu m = menuRepository.findById(menuId).orElseThrow();
		
		MenuReadDto dto = MenuReadDto.builder().id(m.getId()).m_category(m.getM_category())
				.m_name(m.getM_name()).m_price(m.getM_price()).m_stock(m.getM_stock()).m_solded(m.getM_solded())
				.m_pic(m.getM_pic()).m_des(m.getM_description()).build();
		log.info("solded = {}", dto.getM_solded());
		log.info("stock = {}", dto.getM_stock());
		return dto;
	}
	

}
