package com.yobee.oneline.dto.menu;

import com.yobee.oneline.repository.menu.Menu;
import com.yobee.oneline.repository.store.Store;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Data
@Builder
public class MenuCreateDto {

	private Long storeId;
	private String m_category;
	private String m_name;
	private String m_description;
	
	private int m_price;
	private int m_stock;
	
	private String m_pic;

	public Menu toEntity() {
		Menu m = Menu.builder()
				.m_category(this.m_category).m_name(this.m_name)
				.m_description(this.m_description).m_price(this.m_price)
				.m_stock(this.m_stock).m_pic(this.m_pic)
				.build();
		return m;
	}
	

}
