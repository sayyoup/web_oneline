package com.yobee.oneline.repository;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;

@Getter
// @EntityListeners(AuditingEntityListener.class)를 사용하면 (해당 클래스를 참조한 하위클래스가 사용될때) 인서트, 업데이트를 듣고 있다가 자동으로 수정해준다.
// @EnableJpaAuditing를 통해서 main과 연결된다., 이후 JPA Auditing 기능이 활성화 되어 있는 경우에.
@EntityListeners(AuditingEntityListener.class)
// @MappedSuperclass는 다른 도메인(엔터티) 클래스의 상위 클래스로 사용됨(나 슈퍼클래스야!)
// 해당어노테이션을 사용한 클래스를 상속한 하위클래스는 BaseTimeEntity가 정의하는 컬럼들을 갖게된다.(그저 필드추가)
@MappedSuperclass
public class BaseTimeEntity {
	// 여러테이블에서 공통으로 사용되는 생성시간, 수정시간을 속성으로 갖는 객체를 설계
	// 필드의 변수들의 이름은 DB에 설정된 이름과 같거나, 컬럼이름의 카멜표기법으로 작성한다.
	// (예) 테이블에 CREATED_TIEM 이라고 적힐때 (CREATED_TIEM or createdTime)로 적어야한다
	
	// insert 될때 자동기록 @CreatedDate 어노테이션
	@CreatedDate
	private LocalDateTime createdTime;
	
	// update 될때 자동기록 @LastModifiedDate 어노테이션
	@LastModifiedDate
	private LocalDateTime modifiedTime;
	
}
