package com.yobee.oneline.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("/line")
public class LineController {

	@GetMapping("/check_line")
	public void check_line_page(Model model, @RequestParam(name="c_id", defaultValue = "0") long c_id) throws Exception{
		log.info("c_id = {}",c_id);
		model.addAttribute("c_id", c_id);
	}
}
