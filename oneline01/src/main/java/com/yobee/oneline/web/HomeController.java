package com.yobee.oneline.web;


import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.yobee.oneline.repository.store.Store;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class HomeController {

	@GetMapping("/")
	public String main() {
		log.info("home");
		return "redirect:/login"; // view의 이름을 리턴한다.
	}
	
	@GetMapping("/login") 
	public String loginGET() {
		return "/main/index";
	}
	
	@GetMapping("/main/select")
	public String selectPage(HttpSession session, Model model) {
//		Enumeration<String> attrNames= session.getAttributeNames();
//		while (attrNames.hasMoreElements()) {
//			log.info(attrNames.nextElement());
//		}
//		log.info(session.getAttribute("SPRING_SECURITY_CONTEXT").toString());
		SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");
		Store s = (Store) securityContext.getAuthentication().getPrincipal();
		model.addAttribute("s_id", s.getId());
		return "/main/main_select";
	}
}
