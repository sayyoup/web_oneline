package com.yobee.oneline.dto.desk;

import java.util.List;

import com.yobee.oneline.repository.desk.Desk;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DeskReadDto {
	
	private Long id;
	private int d_number;
	private int d_state;
	private int d_count;
	
	private List<String> menus;
	
	private int d_total_price;
}
