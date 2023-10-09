package com.yobee.oneline.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yobee.oneline.dto.customer.CustomerCreateDto;
import com.yobee.oneline.dto.customer.CustomerReadDto;
import com.yobee.oneline.dto.customer.CustomerWaitingLineDto;
import com.yobee.oneline.repository.customer.Customer;
import com.yobee.oneline.repository.customer.CustomerRepository;
import com.yobee.oneline.repository.store.Store;
import com.yobee.oneline.repository.store.StoreRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerService {
	
	private final CustomerRepository customerRepository;
	private final StoreRepository storeRepository;

	// 새줄 등록
	@Transactional
	public long createCustomer(CustomerCreateDto dto, long storeId) {
		
		Customer c = dto.toEntity();
		// 순번 최대번호 + 1
		List<CustomerReadDto> dtoList = readAllOrderbtId(storeId);
		int maxNumber=0;
		for(CustomerReadDto d : dtoList) {
			if(maxNumber<=d.getC_number()) {
				maxNumber=d.getC_number();
			}
		}
		c.setC_number(maxNumber+1);		
		c.setStore(storeRepository.findById(storeId).orElseThrow());
		
		customerRepository.save(c);
		
		return c.getId();
	}
	
	// 손님목록 가져오기
	@Transactional(readOnly = true)
	public List<CustomerReadDto> readAllOrderbtId(Long storeid){		
		List<Customer> cList = customerRepository.findByStoreOrderById(findStoreByStoreId(storeid));
		List<CustomerReadDto> list = getCustomerDtoList(cList);
		return list;
	}
	
	// 상점 아이디로 상점 찾아오기
	public Store findStoreByStoreId(Long StoreId) {
		return storeRepository.findById(StoreId).orElseThrow(); 
	}
	// 손님 목록을 dto list로 변경
	private List<CustomerReadDto> getCustomerDtoList(List<Customer> list) {
		List<CustomerReadDto> result = new ArrayList<>();
		
		for(Customer c : list) {
			CustomerReadDto d = CustomerReadDto.builder().id(c.getId()).c_number(c.getC_number())
			.c_name(c.getC_name()).c_count(c.getC_count())
			.c_state(c.getC_state()).created_time(c.getCreatedTime())
			.modified_time(c.getModifiedTime()).build();
			result.add(d);
		}
		
		return result;
	}

	// 아이디로 삭제
	public void deleteById(Long id) {
		customerRepository.deleteById(id);
	}

	// 아이디로 객체하나 전달
	@Transactional(readOnly = true)
	public CustomerReadDto findById(Long c_id) {
		
		log.info("read All service c_id {}", c_id);
		Customer c = customerRepository.findById(c_id).orElseThrow();
		
		CustomerReadDto dto = CustomerReadDto.builder()
				.id(c_id).c_name(c.getC_name()).c_count(c.getC_count())
				.c_number(c.getC_number()).c_state(c.getC_state())
				.created_time(c.getCreatedTime()).modified_time(c.getModifiedTime())
				.build();
		
		return dto;
	}
	
	// 손님에게 보여질 정보
	@Transactional(readOnly = true)
	public CustomerWaitingLineDto findByIdtoCustomerWaitingLineDto(Long c_id) {
		List<Customer> checkList = customerRepository.findAll();
		int check =0;
		for(Customer cc : checkList) {
			if(cc.getId().equals(c_id)) {
				check = 1;
			}
		}
		if(check == 1) {
			Customer c = customerRepository.findById(c_id).orElseThrow();
			// 반환할 dto
			CustomerWaitingLineDto dto = CustomerWaitingLineDto.builder()
					.c_name(c.getC_name()).c_number(c.getC_number()).build();
			
			// 내앞 대기인원수
			List<Customer> cList = customerRepository.findByStoreOrderById(c.getStore());
			int leftTeam = 0;
			for(Customer s : cList) {
				if(s.getId().equals(c.getId())) {
					dto.setLeftTeam(leftTeam);
					dto.setLeftTime(leftTeam*5);				
				}
				leftTeam++;
			}			
			return dto;
		}else {
			return null;			
		}
	}
	
}
