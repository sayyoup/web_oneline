package com.yobee.oneline.web.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yobee.oneline.dto.user.CheckUsernameAndEmail;
import com.yobee.oneline.dto.user.LoginCheckDto;
import com.yobee.oneline.dto.user.SendCodeDto;
import com.yobee.oneline.dto.user.SendEmailAdressDto;
import com.yobee.oneline.email.EmailService;
import com.yobee.oneline.service.StoreService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/store")
public class StoreRestController {

	private final StoreService storeService;
	private final EmailService emailService;
	
	// 아이디 중복확인기능
	@GetMapping("/check/id/{userStr}")
	public ResponseEntity<Integer> checkTheUserName(@PathVariable String userStr) {
		log.info("username ={}", userStr);
		int result = storeService.findUsernameIsConfirm(userStr);
		return ResponseEntity.ok(result);
	}
	
	// 이메일 중복확인 기능
	@GetMapping("/check/email/{emailStr}")
	public ResponseEntity<Integer> checkTheEmail(@PathVariable String emailStr){
		log.info("emailStr ={}", emailStr);
		int result = storeService.findEmailIsConfirm(emailStr);
		return ResponseEntity.ok(result);
	}
	
	// 이메일, 유저아이디가 서로 일치하는지 검색
	@PostMapping("/check/authenticate")
	public ResponseEntity<Integer> checkTheUsernameAndEmail(@RequestBody CheckUsernameAndEmail dto){
		log.info("dto = {}", dto);
		int result = storeService.checkTheDtoIsCoincide(dto);
		return ResponseEntity.ok(result);
	}
	
	// 이메일 보내기
	@PostMapping("/emailConfirm")
	public void emailConfirm(@RequestBody SendEmailAdressDto dto) throws Exception {
		log.info("메일전송 메일주소 = {}", dto.getEmailStr());
	  	String confirm = emailService.sendSimpleMessage(dto.getEmailStr());
	  	storeService.setCode(dto.getEmailStr(), confirm);
	}
	// 비밀번호 찾기 인증번호 확인
	@PostMapping("/certification")
	public ResponseEntity<Integer> certificationByCode(@RequestBody SendCodeDto dto){
		log.info("code = {}", dto.getCode());
		log.info("em = {}", dto.getEm());
		int result = storeService.checkTheCode(dto);
		return ResponseEntity.ok(result);
	}
	@PostMapping("/login/check")
	public ResponseEntity<Long> checkLogin(@RequestBody LoginCheckDto dto){
		Long result = storeService.getStoreIdByDto(dto);
		return ResponseEntity.ok(result);
	}
	
	@DeleteMapping("/end/today/{storeId}")
	public void endTheStoreToday (@PathVariable long storeId) {
		storeService.endTheToday(storeId);
	}
	
}
