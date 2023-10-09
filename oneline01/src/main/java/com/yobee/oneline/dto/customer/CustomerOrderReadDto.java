package com.yobee.oneline.dto.customer;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerOrderReadDto {
	private Long dt_id;
	private String m_pic;
	private String m_name;
	private int b_count;
	private int m_price;
}
