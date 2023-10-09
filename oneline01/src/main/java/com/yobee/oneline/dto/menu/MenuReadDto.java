package com.yobee.oneline.dto.menu;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MenuReadDto {

	private Long id;
	private String m_category;
	private String m_name;
	private int m_price;
	private int m_stock;
	private int m_solded;
	private String m_des;
	private String m_pic;
}
