package com.yobee.oneline.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yobee.oneline.dto.desk.DeskCreateDto;
import com.yobee.oneline.dto.desk.DeskPriceDto;
import com.yobee.oneline.dto.desk.DeskReadDto;
import com.yobee.oneline.dto.desk.DeskSitDownDto;
import com.yobee.oneline.repository.customer.Customer;
import com.yobee.oneline.repository.customer.CustomerRepository;
import com.yobee.oneline.repository.desk.Desk;
import com.yobee.oneline.repository.desk.DeskRepository;
import com.yobee.oneline.repository.desk.DeskTable;
import com.yobee.oneline.repository.desk.DeskTableRepository;
import com.yobee.oneline.repository.menu.MenuRepository;
import com.yobee.oneline.repository.store.Store;
import com.yobee.oneline.repository.store.StoreRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeskService {
	
	private final DeskRepository deskRepository;
	private final StoreRepository storeRepository;
	private final CustomerRepository customerRepository;
	private final DeskTableRepository deskTableRepository;
	
	// 상점 객체로 읽어오기
	@Transactional(readOnly = true)
	public List<DeskReadDto> readByStore(Store store) throws Exception {
		
		List<Desk> deskLisg = deskRepository.findByStoreOrderById(store);
		List<DeskReadDto> lsit = new ArrayList<>();
		
		for(Desk d : deskLisg) {
			DeskReadDto dd = readOneDeskByDeskId(d.getId());
			lsit.add(dd);
		}
		
		return lsit;
	}
	// 상점 아이디로 읽어오기
	@Transactional(readOnly = true)
	public List<DeskReadDto> readByStoreId(Long storeId) throws Exception{
		Store s = storeRepository.findById(storeId).orElseThrow();
		return readByStore(s);
	}
	
	// 새 desk만들기
	public List<DeskReadDto> createNewDesk(DeskCreateDto dto) throws Exception {
		log.info("새 desk service");
		int number = readByStoreId(dto.getStoreId()).size();
		int count = dto.getCount();
		Desk d = Desk.builder().d_number(number+1).d_count(count).build();
		Store s = storeRepository.findById(dto.getStoreId()).orElseThrow();
		d.setStore(s);
		deskRepository.save(d);
		return readByStoreId(dto.getStoreId());
	}
	
	// 삭제(d_number가 가장 큰 테이블 삭제)
	public void deleteById(Long storeId) throws Exception {
		List<DeskReadDto> dList = readByStoreId(storeId);
		if(dList.size()==0) {
			return;
		}
		
		long maxId = 0;
		int maxCount =0;
		for(DeskReadDto dto : dList) {
			if(maxCount <= dto.getD_number()) {
				maxId = dto.getId();
			}
		}
		deskRepository.deleteById(maxId);
	}
	
	// 배치하기 모달에 적용할 리스트 뽑기
	public List<DeskReadDto> readByLineId(Long lineId) throws Exception {
		Customer c = customerRepository.findById(lineId).orElseThrow();
		// TODO 주문완료시(state) 검색후 d_id 변경하고 c_id 지우기
		int count = c.getC_count();
		
		List<DeskReadDto> dList = readByStore(c.getStore());
		List<DeskReadDto> resultList = new ArrayList<>();
		
		for(DeskReadDto dto : dList) {
			if(count<=dto.getD_count()) {
				if(dto.getD_state()==0) {					
					resultList.add(dto);
				}
			}
		}
		return resultList;
	}
	
	// 좌석에 배치하기 1. desk 상태변화, 2. 대기열 지우기
	@Transactional
	public List<DeskReadDto> setDeskAtCustomer(DeskSitDownDto dto) throws Exception {
		Desk d = deskRepository.findById(dto.getDeskId()).orElseThrow();
		Customer c = customerRepository.findById(dto.getLineId()).orElseThrow();
		// 상황1 손님이 미리주문 했을때,
		int totalPrice = 0;
		if (c.getC_state() == 1) {
			List<DeskTable> dtList = deskTableRepository.findByCustomer(c);
			for(DeskTable dt : dtList) {
				dt.setDesk(d);
				totalPrice += dt.getDt_price();
			}
		}
		d.setD_total_price(totalPrice);
		// 1. 테이블 상태변경, 2. 손님 지우기
		d.setD_state(1);
		customerRepository.delete(c);

		return readByStore(d.getStore());
	}
	
	// 데스크 아이디로 데스크 정보리턴
	public DeskReadDto readOneDeskByDeskId(Long deskId) throws Exception{
		Desk d = deskRepository.findById(deskId).orElseThrow();
		List<DeskTable> dtList = deskTableRepository.findByDesk(d);
		List<String> menuList = new ArrayList<>();
		
		for(DeskTable dt : dtList) {
			String name = dt.getMenu().getM_name();
			String count = " (" + dt.getDt_count() + ")";
			String m =  name+count;
			menuList.add(m); 
		}
		DeskReadDto dto = DeskReadDto.builder().id(d.getId()).d_number(d.getD_number()).d_count(d.getD_count())
				.menus(menuList).d_state(d.getD_state()).d_total_price(d.getD_total_price()).build();
		return dto;
	}
	
	// 데스크에 상태 변화 자리참으로 변환시 1 리턴 반대 0리턴
	@Transactional
	public int changeStateById(long deskId) {
		// TODO 만일 deskId 값을 가진 모든 desktable들 전부 삭제

		Desk d = deskRepository.findById(deskId).orElseThrow();
		d.changeState();
		
		if(d.getD_state()==1) {
			return 1;
		}else {
			return 0;
		}
		
	}
	
	// desk의 총금액 초기화 후 dto로 반환
	@Transactional
	public DeskPriceDto readPriceByDeskId(Long deskId) {
		Desk d = deskRepository.findById(deskId).orElseThrow();
		List<DeskTable> dtList = deskTableRepository.findByDeskId(deskId);
		// 총 금액초기화
		int total = 0;
		for(DeskTable dt : dtList) {
			total += dt.getDt_price();
		}
		d.setD_total_price(total);
		return DeskPriceDto.builder().d_total_price(d.getD_total_price()).d_discount_price(d.getD_discount_price())
				.d_receive_price(d.getD_receive_price()).build();
	}
	
	

}
