package com.yobee.oneline.repository.customer;

import java.time.format.DateTimeFormatter;

import com.yobee.oneline.repository.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "CUSTOMER_BASKET")
@Entity
@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SequenceGenerator(name = "CUSTOMER_BASKET_SEQ_GEN", sequenceName = "CUSTOMER_BASKET_SEQ",allocationSize = 1)
public class CustomerBasket{

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "CUSTOMER_BASKET_SEQ_GEN")
	private Long id;
	
	@Column(nullable = false)
	private Long m_id;
	
	@Column(nullable = false)
	private Long c_id;
	
	@Column(nullable = false)
	private int m_count;
	
	@Column(nullable = false)
	private int m_price;
	
}
