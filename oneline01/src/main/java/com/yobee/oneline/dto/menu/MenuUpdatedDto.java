package com.yobee.oneline.dto.menu;

import com.yobee.oneline.repository.menu.Menu;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MenuUpdatedDto {

	private Long id;
	private String m_category;
	private String m_name;
	private int m_price;
	private String m_description;
	
	private int m_stock;
	private String m_pic;
	
	public Menu toEntity() {
		return Menu.builder().id(this.id).m_category(this.m_category)
				.m_name(this.m_name).m_price(this.m_price).m_description(this.m_description)
				.m_stock(this.m_stock).m_pic(this.m_pic).build();
	}
}
