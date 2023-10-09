package com.yobee.oneline.web.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yobee.oneline.dto.dtable.DtableReadDto;
import com.yobee.oneline.dto.dtable.DtableSelectedDeleteDto;
import com.yobee.oneline.dto.dtable.InputCalculatorDto;
import com.yobee.oneline.dto.dtable.MenuAndDeskIdDto;
import com.yobee.oneline.dto.dtable.payModalDto;
import com.yobee.oneline.service.DeskTableService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/dtable")
public class DeskTableRestControll {

	private final DeskTableService deskTableService;
	
	@GetMapping("/readAll/{deskId}")
	public ResponseEntity<List<DtableReadDto>> readAllDTableList(@PathVariable Long deskId){
		log.info("모든 주문 보기");
		List<DtableReadDto> dlist = deskTableService.readAllDTList(deskId);
		return ResponseEntity.ok(dlist);
	}
	
	// 메뉴추가
	@PutMapping("/add/menu/{menuId}")
	public ResponseEntity<List<DtableReadDto>> addNewMenuAtDTable(@RequestBody MenuAndDeskIdDto dto){
		List<DtableReadDto> dtoList = deskTableService.createOrUpdateNeDeskTable(dto);
		return ResponseEntity.ok(dtoList); 
	}
	
	// 전체삭제
	@DeleteMapping("/delete/{deskId}")
	public void deleteAllByDeskId(@PathVariable long deskId){
		log.info("전체삭제 deskId = {}", deskId);
		deskTableService.dleteAllOrederByDeskId(deskId);
	}

	// 선택 삭제
	@PutMapping("/delete/selected/{deskId}")
	public void deleteSeletedByDeskId(@RequestBody DtableSelectedDeleteDto dto) {
		deskTableService.dleteSelectedOrederByDeskId(dto);
	}
	
	// 마이너스 
	@PutMapping("/minus/{oId}")
	public void btnMinus(@PathVariable Long oId) {
		deskTableService.countDown(oId);
	}
	
	// 플러스
	@PutMapping("/plus/{oId}")
	public ResponseEntity<Integer> btnPlus(@PathVariable Long oId) {
		int i =deskTableService.countUp(oId);
		return ResponseEntity.ok(i);
	}
	
	// 할인금, 받은금액 초기화
	@PutMapping("/reset/price/{deskId}")
	public void resetAllPrice(@PathVariable Long deskId) {
		deskTableService.resetAllPrice(deskId);
	}
	
	// 추가금
	@PutMapping("/add/price/{deskId}")
	public void addPrice(@PathVariable Long deskId, @RequestBody InputCalculatorDto dto) {
		
		deskTableService.setAddPrice(deskId, dto.getInputCalculator());
	}
	
	// 할인금
	@PutMapping("/add/discount/{deskId}")
	public ResponseEntity<Integer> addDiscount(@PathVariable Long deskId, @RequestBody InputCalculatorDto dto) {
		int result = deskTableService.setDiscountPrice(dto);
		return ResponseEntity.ok(result);
	}
	
	// 결제버튼
	@PutMapping("/pay/success/{deskId}")
	public ResponseEntity<Integer> paySuccess(@PathVariable Long deskId, @RequestBody payModalDto dto){
		log.info("dto = {}", dto);
		int result = deskTableService.endPay(deskId, dto);
		return ResponseEntity.ok(result);
	}
	
}
