package com.yobee.oneline.dto.desk;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DeskPriceDto {
	
	private int d_total_price;
	private int d_discount_price;
	private int d_receive_price;


}
