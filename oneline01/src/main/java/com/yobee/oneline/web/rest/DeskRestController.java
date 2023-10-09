package com.yobee.oneline.web.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yobee.oneline.dto.desk.DeskCreateDto;
import com.yobee.oneline.dto.desk.DeskPriceDto;
import com.yobee.oneline.dto.desk.DeskReadDto;
import com.yobee.oneline.dto.desk.DeskSitDownDto;
import com.yobee.oneline.repository.store.Store;
import com.yobee.oneline.service.DeskService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/desk")
public class DeskRestController {

	private final DeskService deskService;
	
	// 포스 메인에 desk 전체 보기
	@GetMapping("/all/{storeId}")
	public ResponseEntity<List<DeskReadDto>> readAllByStoreId(@PathVariable Long storeId, HttpSession session) throws Exception {
		log.info("데스크 불러오기");

		SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");
		Store s = (Store) securityContext.getAuthentication().getPrincipal();
		
		List<DeskReadDto> dtoList = deskService.readByStoreId(s.getId());
		return ResponseEntity.ok(dtoList);
	}	
	
	// 배치하기 모달에 가능한 desk만 보기
	@GetMapping("/arrangement/{lineId}")
	public ResponseEntity<List<DeskReadDto>> readDeskArrangementModal(@PathVariable Long lineId) throws Exception{
		log.info("데스크(배치모달) 불러오기");
		List<DeskReadDto> dtoList = deskService.readByLineId(lineId);
		return ResponseEntity.ok(dtoList);
	}
	
	// 새 desk 만들기
	@PostMapping("/create")
	public ResponseEntity<List<DeskReadDto>> createDesk(@RequestBody DeskCreateDto dto, HttpSession session) throws Exception{

		SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");
		Store s = (Store) securityContext.getAuthentication().getPrincipal();
		dto.setStoreId(s.getId());
		log.info("새 데스크 컨트롤러 {}", dto);
		
		List<DeskReadDto> dtoList = deskService.createNewDesk(dto);
		return ResponseEntity.ok(dtoList);
	}
	
	// number가 제일 큰 테이블 삭제
	@DeleteMapping("/delete/{storeId}")
	public void deleteDesk(@PathVariable Long storeId, HttpSession session) throws Exception{

		SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");
		Store s = (Store) securityContext.getAuthentication().getPrincipal();
		deskService.deleteById(s.getId());
		
	}
	
	// 자리 배치하기
	@PutMapping("/sitdown/{deskId}")
	public ResponseEntity<List<DeskReadDto>> sitDown(@RequestBody DeskSitDownDto dto)  throws Exception{
		log.info("줄 컨트롤러 {}",dto);
		List<DeskReadDto> dtoList = deskService.setDeskAtCustomer(dto);
		return ResponseEntity.ok(dtoList);
	}
	
	// 상태변화 버튼처리
	@PutMapping("/change/state/{deskId}")
	public ResponseEntity<Integer> changeDeskState(@PathVariable long deskId) {
		int i = deskService.changeStateById(deskId);
		return ResponseEntity.ok(i);
	}
	
	// 금액초기화
	@GetMapping("price/reset/{deskId}")
	public ResponseEntity<DeskPriceDto> setPrice(@PathVariable Long deskId){
		DeskPriceDto dpd = deskService.readPriceByDeskId(deskId);
		return ResponseEntity.ok(dpd);
	}
	
}
