package com.yobee.oneline.dto.customer;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerBasketReadDto {
	
	private long m_id;
	private long b_id;
	
	private String m_name;
	private String m_pic;
	
	private int m_price;
	private int b_count;
	
}
