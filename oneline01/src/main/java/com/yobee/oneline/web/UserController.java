package com.yobee.oneline.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.yobee.oneline.dto.user.UserCreateDto;
import com.yobee.oneline.dto.user.settingNewPasswordPageDto;
import com.yobee.oneline.service.StoreService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

	private final StoreService storeService;
	
	// 회원 가입
	@GetMapping("/sing_up")
	public void sing_up_page() {
		log.info("sing_up_page");
	}
	@PostMapping("/sing_up")
	public String sing_up(UserCreateDto dto) {
		log.info("dto = {}", dto);
		storeService.createNewStroeByDto(dto);
		return "redirect:/";
	}
	
	// 비밀번호 찾기
	@GetMapping("/find_password")
	public void find_password_page() {
		log.info("find_password_page");
	}
	
	@PostMapping("/find_password")
	public String find_password() {
		log.info("find_password_page");
		
		return "redirect:/user/new_password?";
	}
	
	// 새 비밀번호 설정
	@PostMapping("/new_password")
	public void new_password(Model model, String email) {
		log.info("email = {}", email);
		model.addAttribute("email", email);
	}
	
	@PostMapping("/update_password")
	public String update_password(settingNewPasswordPageDto dto) {
		storeService.setNewPassword(dto);
		return "redirect:/";
	}
}
