package com.yobee.oneline.repository.menu;

import java.time.format.DateTimeFormatter;

import com.yobee.oneline.dto.menu.MenuUpdatedDto;
import com.yobee.oneline.repository.BaseTimeEntity;
import com.yobee.oneline.repository.store.Store;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "MENU")
@SequenceGenerator(name = "MENU_SEQ_GEN", sequenceName = "MENU_SEQ", allocationSize = 1)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Menu extends BaseTimeEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "MENU_SEQ_GEN")
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private Store store;
	
	@Column(nullable = false)
	private String m_name;
	
	@Column(nullable = false)
	private String m_description;
	
	@Column()
	private String m_pic;
	
	@Column(nullable = false)
	private String m_category;
	
	@Column(nullable = false)
	private int m_price;
	
	@Column(nullable = false)
	private int m_stock;
	
	@Column()
	private int m_solded;

	
	// 시간정보 포메팅
	public String getCreatedTimeToFormat() {
		return this.getCreatedTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	}
	public String getModifiedTimeToFormat() {
		return this.getModifiedTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	}
	
	public Menu upadte(Store s) {
		return Menu.builder().id(this.id).store(s).m_name(this.m_name)
				.m_description(this.m_description).m_pic(this.m_pic).m_category(this.m_category)
				.m_price(this.m_price).m_stock(this.m_stock).m_solded(this.m_solded).build();
	}
	
	public void upadteWithUpdateDto(MenuUpdatedDto dto) {
		this.m_name = dto.getM_name();
		this.m_description = dto.getM_description();
		this.m_pic = dto.getM_pic();
		this.m_category = dto.getM_category();
		this.m_price = dto.getM_price();
		this.m_stock = dto.getM_stock();
	}
	
	
}
