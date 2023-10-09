package com.yobee.oneline.repository.customer;

import java.time.format.DateTimeFormatter;

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

@Table(name = "CUSTOMER")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@SequenceGenerator(name = "CUSTOMER_SEQ_GEN", sequenceName = "CUSTOMER_SEQ", allocationSize = 1)
public class Customer extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "CUSTOMER_SEQ_GEN")
	private Long id;
	
	@Column(nullable = false)
	private String c_name;
	
	@Column(nullable = false)
	private int c_count;
	
	@Column(nullable = false)
	private int c_number;
	
	@Column(nullable = false)
	private int c_state;
	
	@Column(nullable = false)
	private String c_phone;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private Store store;
	
	// 시간정보 포메팅
	public String getCreatedTimeToFormat() {
		return this.getCreatedTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	}
	public String getModifiedTimeToFormat() {
		return this.getModifiedTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	}
	
}
