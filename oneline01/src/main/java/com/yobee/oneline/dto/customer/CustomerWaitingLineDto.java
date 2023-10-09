package com.yobee.oneline.dto.customer;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerWaitingLineDto {
	String c_name;
	int c_number;
	int leftTeam;
	int leftTime;
}
