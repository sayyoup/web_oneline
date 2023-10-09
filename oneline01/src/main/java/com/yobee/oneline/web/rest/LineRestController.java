package com.yobee.oneline.web.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yobee.oneline.dto.customer.CustomerReadDto;
import com.yobee.oneline.service.CustomerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/line")
public class LineRestController {

	private final CustomerService customerService;
	
	// 줄목록 전체 불러오기
	@GetMapping("/all/{sotreId}")
	public ResponseEntity<List<CustomerReadDto>> readAllLine(@PathVariable Long sotreId){
		log.info("줄 로드");
		List<CustomerReadDto> result = customerService.readAllOrderbtId(sotreId);
		return ResponseEntity.ok(result);
	}
	
	// 삭제
	@DeleteMapping("/delete/{id}")
	public void deleteById(@PathVariable Long id) {
		log.info("줄 삭제");
		customerService.deleteById(id);
	}
	
}
