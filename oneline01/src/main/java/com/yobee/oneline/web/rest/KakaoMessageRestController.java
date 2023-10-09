package com.yobee.oneline.web.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yobee.oneline.dto.customer.CustomerCreateDto;
import com.yobee.oneline.service.CustomerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/kakao")
public class KakaoMessageRestController {

	private final CustomerService customerService;

	@PostMapping("/create/customer/{storeId}")
	public ResponseEntity<Long> createCustomer(@PathVariable long storeId, @RequestBody CustomerCreateDto dto){
		log.info("상점아이디 {}",storeId);
		log.info("dto {}",dto.toString());
		
		long customerId = customerService.createCustomer(dto, storeId);
		return ResponseEntity.ok(customerId);
	}
	
}
