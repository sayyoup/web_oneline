package com.yobee.oneline.repository.desk;

import java.time.format.DateTimeFormatter;

import com.yobee.oneline.repository.BaseTimeEntity;
import com.yobee.oneline.repository.customer.Customer;
import com.yobee.oneline.repository.menu.Menu;
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
@Table(name = "DESK_TABLE")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@SequenceGenerator(name="DESK_TABLE_SEQ_GEN", sequenceName = "DESK_TABLE_SEQ", allocationSize = 1)
public class DeskTable extends BaseTimeEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "DESK_TABLE_SEQ_GEN")
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private Menu menu;

	@ManyToOne(fetch = FetchType.LAZY)
	private Desk desk;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private Customer customer;
	
	@Column(nullable = false)
	private int dt_count;
	
	@Column(nullable = false)
	private int dt_price;
	
	
	
	// 시간정보 포메팅
	public String getCreatedTimeToFormat() {
		return this.getCreatedTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	}
	public String getModifiedTimeToFormat() {
		return this.getModifiedTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	}
	
	public void updateCountAndPrice(int count, int price) {
		this.dt_count = count;
		this.dt_price = price;
	}
	
	
	
}
