package com.yobee.oneline.dto.customer;

import lombok.Data;

@Data
public class AddNewBasketDto {
	private long cid;
	private long mid;
	private int count;
}
