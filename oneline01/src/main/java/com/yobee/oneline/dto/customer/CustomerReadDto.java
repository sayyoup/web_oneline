package com.yobee.oneline.dto.customer;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerReadDto {

	private Long id;
	private String c_name;
	private int c_count;
	private int c_number;
	private int c_state;
	
	private LocalDateTime created_time;
	private LocalDateTime modified_time;
	
	
}
