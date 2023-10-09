package com.yobee.oneline.repository.desk;

import java.time.format.DateTimeFormatter;

import com.yobee.oneline.repository.BaseTimeEntity;
import com.yobee.oneline.repository.store.Store;

import groovy.transform.ToString;
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
@Table(name = "DESK")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
@SequenceGenerator(name="DESK_SEQ_GEN", sequenceName = "DESK_SEQ", allocationSize = 1)
public class Desk extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "DESK_SEQ_GEN")
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private Store store;
	
	@Column(nullable = false)
	private int d_number;
	
	@Column(nullable = false)
	private int d_count;
	
	@Column()
	private int d_state;
	
	@Column()
	private int d_total_price;
	
	@Column()
	private int d_discount_price;
	
	@Column()
	private int d_receive_price;
	
	// 시간정보 포메팅
	public String getCreatedTimeToFormat() {
		return this.getCreatedTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	}
	public String getModifiedTimeToFormat() {
		return this.getModifiedTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	}
	
	// 데스크 상태변화
	public void changeState() {
		if(this.getD_state()==0) {
			this.setD_state(1);
		}else {
			this.setD_state(0);			
		}
	}
	
}
