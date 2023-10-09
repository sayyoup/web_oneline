package com.yobee.oneline.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yobee.oneline.dto.customer.AddNewBasketDto;
import com.yobee.oneline.dto.customer.CustomerBasketReadDto;
import com.yobee.oneline.dto.customer.CustomerGetBasketDto;
import com.yobee.oneline.dto.customer.CustomerOrderReadDto;
import com.yobee.oneline.repository.customer.Customer;
import com.yobee.oneline.repository.customer.CustomerBasket;
import com.yobee.oneline.repository.customer.CustomerBasketRepository;
import com.yobee.oneline.repository.customer.CustomerRepository;
import com.yobee.oneline.repository.desk.DeskTable;
import com.yobee.oneline.repository.desk.DeskTableRepository;
import com.yobee.oneline.repository.menu.Menu;
import com.yobee.oneline.repository.menu.MenuRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerBasketService {
	
	private final CustomerRepository customerRepository;
	private final CustomerBasketRepository customerBasketRepository;
	private final MenuRepository menuRepository;
	private final DeskTableRepository deskTableRepository;
	
	// 장바구니 추가
	@Transactional
	public void createNewRow(CustomerGetBasketDto dto) {
		
		log.info("장바구니 추가");
		Menu m = menuRepository.findById(dto.getMenuId()).orElseThrow();
		List<CustomerBasket> cbList = customerBasketRepository.findAll();
		int check =0;
		
		// 이미 상품이 존재하는 경우
		for(CustomerBasket cb : cbList) {
			if(cb.getM_id().equals(m.getId())) {
				check=1;
				cb.setM_count(cb.getM_count()+1);
				cb.setM_price(cb.getM_count()*m.getM_price());
			}
		}
		// 새상품 추가
		if(check==0) {			
			CustomerBasket cb = CustomerBasket.builder()
					.m_id(dto.getMenuId()).c_id(dto.getCustomerId())
					.m_count(1).m_price(m.getM_price())
					.build();
			customerBasketRepository.save(cb);
		}
	}

	// 판매가능 갯수 반환(범위 내면 저장후 0 리턴)
	@Transactional
	public int getCanSoldCount(AddNewBasketDto dto) {
		
		Menu m = menuRepository.findById(dto.getMid()).orElseThrow();
		
		List<CustomerBasket> cbList = customerBasketRepository.findAll();
		int check =0;
		
		// 이미 상품이 존재하는 경우
		for(CustomerBasket cb : cbList) {
			if(cb.getM_id().equals(m.getId())) {
				check=1;
				// 판매량 초과
				if(m.getM_stock() - m.getM_solded()-dto.getCount() <= 0) {
					return m.getM_stock() - m.getM_solded();
				}else {
					cb.setM_count(cb.getM_count()+dto.getCount());
					cb.setM_price(cb.getM_count()*m.getM_price());
					m.setM_solded(m.getM_solded()+dto.getCount());
					return 0;
				}
			}
		}
		// 새상품 추가
		if(check==0 && m.getM_stock() - m.getM_solded()-dto.getCount() > 0) {			
			CustomerBasket cb = CustomerBasket.builder()
					.m_id(dto.getMid()).c_id(dto.getCid())
					.m_count(dto.getCount()).m_price(m.getM_price()*dto.getCount())
					.build();
			m.setM_solded(m.getM_solded()+dto.getCount());
			
			customerBasketRepository.save(cb);
			return 0;
		}else {
			return m.getM_stock() - m.getM_solded();
		}
	}

	// 모든 장바구니 읽기
	@Transactional(readOnly = true)
	public List<CustomerBasketReadDto> readAllBasketByCid(long cid) {
		List<CustomerBasket> cbList =  customerBasketRepository.findAll();
		List<CustomerBasketReadDto> dtoList = new ArrayList<>();
		for(CustomerBasket cb : cbList) {
			if(cb.getC_id()==cid) {			
				Menu m = menuRepository.findById(cb.getM_id()).orElseThrow();
				CustomerBasketReadDto dto = CustomerBasketReadDto.builder().m_id(m.getId()).b_id(cb.getId())
						.m_name(m.getM_name()).m_price(cb.getM_price()).b_count(cb.getM_count()).m_pic(m.getM_pic()).build();
				dtoList.add(dto);
			}
			
		}
		
		
		return dtoList;
	}

	// 장바구니 삭제
	public void deleteByBid(long b_id) {
		customerBasketRepository.deleteById(b_id);
	}

	// 장바구니 카운트 다운
	@Transactional
	public void BasketCountDown(long b_id) {
		CustomerBasket cb = customerBasketRepository.findById(b_id).orElseThrow();
		Menu m = menuRepository.findById(cb.getM_id()).orElseThrow();
		
		cb.setM_count(cb.getM_count() -1);
		cb.setM_price(m.getM_price()*cb.getM_count());
	}

	// 장바구니 카운트 업
	@Transactional
	public int BasketCountUp(long b_id) {
		CustomerBasket cb = customerBasketRepository.findById(b_id).orElseThrow();
		Menu m = menuRepository.findById(cb.getM_id()).orElseThrow();
		if(m.getM_stock() - m.getM_solded() - 1 < 0) {
			return 0;
		}
		cb.setM_count(cb.getM_count() + 1);
		cb.setM_price(cb.getM_count()*m.getM_price());
		m.setM_solded(m.getM_solded() + 1);
		return 1;
	}

	@Transactional
	public void changeBasketToDeskTable(long c_id) {
		log.info("주문완료 서비스 {}", c_id);
		
		// 장바구니
		List<CustomerBasket> cbList = customerBasketRepository.findAll();
		Customer c = customerRepository.findById(c_id).orElseThrow();
		c.setC_state(1);
		// 실제 주문테이블
		List<DeskTable> dtList = deskTableRepository.findByCustomer(c); 
		// 상황 1 주문테이블에서 이미 메뉴가 존재하는 경우
		for(CustomerBasket cb : cbList) {
			Menu m = menuRepository.findById(cb.getM_id()).orElseThrow();
			// 해당하는 데이터만 가져오기
			if(cb.getC_id()==c_id) {
				int check = 0;
				for(DeskTable dt : dtList) {
					// 이미 상품이 있는경우
					if(dt.getMenu().getId()==m.getId()) {
						check = 1;
						
						dt.setDt_count(dt.getDt_count()+cb.getM_count());
						dt.setDt_price(dt.getDt_count()*m.getM_price());
						
						
						customerBasketRepository.delete(cb);
					}
				}
				// 새상품의 경우
				if(check==0) {
					DeskTable sdt = DeskTable.builder().menu(m).desk(null).customer(c)
							.dt_count(cb.getM_count()).dt_price(cb.getM_price()).build();
					deskTableRepository.save(sdt);
					customerBasketRepository.delete(cb);
				}
			}			
		}
	}
	// 주문리스트 보내기
	@Transactional(readOnly = true)
	public List<CustomerOrderReadDto> readAllOrdertByCid(long cId) {
		log.info("주문리스트 가져오기 {}", cId);
		Customer c = customerRepository.findById(cId).orElseThrow();
		List<DeskTable> dtList = deskTableRepository.findByCustomer(c);
		List<CustomerOrderReadDto> dtoList = new ArrayList<>();
		for(DeskTable dt : dtList) {
			Menu m = menuRepository.findById(dt.getMenu().getId()).orElseThrow();
			CustomerOrderReadDto dto = CustomerOrderReadDto.builder().dt_id(dt.getId()).m_pic(m.getM_pic())
					.m_name(m.getM_name()).b_count(dt.getDt_count()).m_price(dt.getDt_price())
					.build();
			
			dtoList.add(dto);
		}		
		return dtoList;
	}

	// 주문취소
	public void deleteOrdertByid(long dtId) {
		
		DeskTable dt = deskTableRepository.findById(dtId).orElseThrow();
		
		List<DeskTable> dtList = deskTableRepository.findByCustomer(dt.getCustomer()); 
		if(dtList.size()==1) {
			dt.getCustomer().setC_state(0);
		}
		
		deskTableRepository.deleteById(dtId);
	}
	
}
