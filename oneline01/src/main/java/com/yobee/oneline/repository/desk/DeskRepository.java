package com.yobee.oneline.repository.desk;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yobee.oneline.repository.store.Store;

public interface DeskRepository extends JpaRepository<Desk, Long>{

	// 매장아이디로
	List<Desk> findByStoreOrderById(Store store);
	
}
