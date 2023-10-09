package com.yobee.oneline.web;


import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.yobee.oneline.dto.desk.DeskReadDto;
import com.yobee.oneline.repository.store.Store;
import com.yobee.oneline.service.DeskService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/force")
public class ForceController {

	private final DeskService deskService;
	
	@GetMapping("/force_main")
	public void force_main(HttpSession session, Model model) {
		log.info("force_main (포스기 메인 페이지)");
		SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");
		Store s = (Store) securityContext.getAuthentication().getPrincipal();
		model.addAttribute("s_id", s.getId());
	}
	
	@GetMapping("/force_desk_detail")
	public void force_desk_detail_page(Model model, @RequestParam(name="id", defaultValue = "0") long id) throws Exception{
		log.info("force_desk_detail_page (데스크 디테일 페이지)");
		
		DeskReadDto dto =deskService.readOneDeskByDeskId(id);
		model.addAttribute("deskInfo", dto);
	}
	
	
}
