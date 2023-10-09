package com.yobee.oneline.web;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yobee.oneline.dto.customer.CustomerCreateDto;
import com.yobee.oneline.repository.store.Store;
import com.yobee.oneline.service.CustomerService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/kiosk")
public class KioskController {

	private final CustomerService customerService;
	
	// 
	@GetMapping("/line_registration")
	public void registration_page(HttpSession session, Model model) {
		
		SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");
		Store s = (Store) securityContext.getAuthentication().getPrincipal();	
		long storeId = s.getId();
		
		model.addAttribute("storeId", storeId);
		log.info("line_registration (줄 등록 페이지)");
	}
	
	// 줄서기 등록 완료
	@GetMapping("/registration_complete")
	public void registration_complete() {
		log.info("registration_complete (줄 등록 완료 페이지)");
	}

	// 줄 등록
	@PostMapping("/create")
	public String line_create(CustomerCreateDto dto, HttpSession session) {
		
		SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");
		Store s = (Store) securityContext.getAuthentication().getPrincipal();		
		
		
		customerService.createCustomer(dto, s.getId());
		
		return "redirect:/kiosk/registration_complete";
	}
}
