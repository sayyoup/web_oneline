package com.yobee.oneline.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.yobee.oneline.dto.menu.MenuReadDto;
import com.yobee.oneline.service.MenuService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/menu")
public class MenuController {
		
	@GetMapping("/menu_list")
	public void menu_list_page(Model model, @RequestParam(name="c_id", defaultValue = "0") long c_id) throws Exception{
		model.addAttribute("c_id",c_id);
		log.info("menu_list_page");
	}
	
	@GetMapping("/menu_detail")
	public void menu_detail_page(Model model, @RequestParam(name="m_id", defaultValue = "0") long m_id, @RequestParam(name="c_id", defaultValue = "0") long c_id) throws Exception {
		log.info("menu_detail_page");
		
		model.addAttribute("c_id", c_id);
		model.addAttribute("m_id", m_id);
	}
	
	@GetMapping("/menu_basket")
	public void menu_basket_page(Model model, @RequestParam(name="c_id", defaultValue = "0") long c_id) throws Exception {
		log.info("menu_basket_page");
		model.addAttribute("c_id",c_id);
	}
	
	@GetMapping("/menu_order_list")
	public void menu_approval_page(Model model, @RequestParam(name="c_id", defaultValue = "0") long c_id) throws Exception {
		log.info("menu_order_list_page");
		model.addAttribute("c_id",c_id);
	}
}
