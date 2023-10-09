package com.yobee.oneline.dto.dtable;

import com.yobee.oneline.repository.desk.DeskTable;
import com.yobee.oneline.repository.menu.Menu;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DtableReadDto {
	
	private Long id;
	
	private String m_name;
	private String m_category;
	
	private int m_price;
	private int dt_count;
	
	public static DtableReadDto toEntity(DeskTable dt) {
		
		Menu m = dt.getMenu();
		
		return DtableReadDto.builder().id(dt.getId())
				.m_name(m.getM_name())
				.m_category(m.getM_category())
				.m_price(m.getM_price())
				.dt_count(dt.getDt_count())
				.build();
				
	}
	
}
