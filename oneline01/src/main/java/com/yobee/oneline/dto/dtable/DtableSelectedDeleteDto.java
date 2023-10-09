package com.yobee.oneline.dto.dtable;

import java.util.List;

import lombok.Data;

@Data
public class DtableSelectedDeleteDto {
	private List<Long> selectedList;
	private Long deskId;
}
