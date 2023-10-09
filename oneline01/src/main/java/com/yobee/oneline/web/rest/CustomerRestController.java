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

import com.yobee.oneline.dto.customer.AddNewBasketDto;
import com.yobee.oneline.dto.customer.CustomerBasketReadDto;
import com.yobee.oneline.dto.customer.CustomerGetBasketDto;
import com.yobee.oneline.dto.customer.CustomerOrderReadDto;
import com.yobee.oneline.dto.customer.CustomerWaitingLineDto;
import com.yobee.oneline.dto.menu.MenuReadDto;
import com.yobee.oneline.service.CustomerBasketService;
import com.yobee.oneline.service.CustomerService;
import com.yobee.oneline.service.MenuService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/customer")
public class CustomerRestController {
	
	private final CustomerService customerService;
	private final MenuService menuService;
	private final CustomerBasketService customerBasketService;

	// 포스기에서 손님목록 전체보기
	@GetMapping("/read/all/{c_id}")
	public ResponseEntity<CustomerWaitingLineDto> readCostomerAll(@PathVariable Long c_id){
		log.info("read All costomer c_id {}", c_id);
		CustomerWaitingLineDto dto = customerService.findByIdtoCustomerWaitingLineDto(c_id);
		log.info("read All costomer dto {}", dto);
		return ResponseEntity.ok(dto);
	}
	
	// 손님폰에서 메뉴리스트 전체보기
	@GetMapping("/all/menu/{customerId}")
	public ResponseEntity<List<MenuReadDto>> readAllMenuList(@PathVariable Long customerId){
		List<MenuReadDto> dList = menuService.findByCustomerId(customerId);
		return ResponseEntity.ok(dList);
	}
	
	// 상품 장바구니에 추가
	@PutMapping("/getmeun/{customerId}")
	public void getNewBasketMenu(@RequestBody CustomerGetBasketDto dto) {
		log.info("장바구니 추가");
		customerBasketService.createNewRow(dto);
	}
	
	// 디테일에서 장바구니에 추가
	@PutMapping("/add/basket/{inputCId}")
	public ResponseEntity<Integer> addNewBasket(@RequestBody AddNewBasketDto dto){
		log.info("dto = {}",dto);
		int count = customerBasketService.getCanSoldCount(dto);
		return ResponseEntity.ok(count);
	}
	
	// 장바구니 리스트 페이지
	@GetMapping("/read/all/basket/{cid}")
	public ResponseEntity<List<CustomerBasketReadDto>> readAllBasket(@PathVariable long cid){
		List<CustomerBasketReadDto> cbList = customerBasketService.readAllBasketByCid(cid);
		return ResponseEntity.ok(cbList);
	}
	
	// 장바구니 삭제
	@DeleteMapping("/basket/delete/{b_id}")
	public void deleteBasketByBid(@PathVariable long b_id) {
		customerBasketService.deleteByBid(b_id);
	}
	
	// 마이너스 버튼
	@PutMapping("/basket/minus/{b_id}")
	public void minusBasketCount(@PathVariable long b_id) {
		customerBasketService.BasketCountDown(b_id);
	}
	
	// 플러스 버튼
	@PutMapping("/basket/plus/{b_id}")
	public ResponseEntity<Integer> plusBasketCount(@PathVariable long b_id){
		int result = customerBasketService.BasketCountUp(b_id);
		return ResponseEntity.ok(result);
	}
	
	// 주문완료버튼 처리
	@PutMapping("/basket/order/{cid}")
	public void changeCustomerBasketToDeskTable(@PathVariable long cid) {
		log.info("주문완료 컨트롤러 {}", cid);
		customerBasketService.changeBasketToDeskTable(cid);
	}
	
	// 완료된 주문 내역 보기
	@GetMapping("/read/all/order/{cId}")
	public ResponseEntity<List<CustomerOrderReadDto>> readAllOrderList(@PathVariable long cId){
		List<CustomerOrderReadDto> dtoList = customerBasketService.readAllOrdertByCid(cId);
		return ResponseEntity.ok(dtoList);
	}
	
	// 주문취소
	@DeleteMapping("/delete/order/{dtId}")
	public void calcelTheOrder(@PathVariable long dtId) {
		customerBasketService.deleteOrdertByid(dtId);
	}
	
	@GetMapping("/read/one/order/{tdid}")
	public ResponseEntity<List<CustomerOrderReadDto>> readOneOrderById(@PathVariable long tdid){
		List<CustomerOrderReadDto> dtoList = customerBasketService.readAllOrdertByCid(tdid);
		return ResponseEntity.ok(dtoList);
	}
	
}
