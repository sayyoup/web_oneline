package com.yobee.oneline.dto.customer;

import com.yobee.oneline.repository.customer.Customer;
import com.yobee.oneline.repository.store.Store;
import com.yobee.oneline.repository.store.StoreRepository;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Data
public class CustomerCreateDto {
	
	private String phone;
	private int member;
	private Long storeId;
	
	public Customer toEntity() {
		String name = this.getPhone().substring(this.getPhone().length()-4, this.getPhone().length());
		return Customer.builder().c_name(name).c_count(this.member).c_state(0).c_phone(this.phone).build();
	}
	
}
