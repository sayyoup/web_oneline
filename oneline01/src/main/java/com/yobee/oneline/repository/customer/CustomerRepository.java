package com.yobee.oneline.repository.customer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.yobee.oneline.repository.store.Store;


public interface CustomerRepository extends JpaRepository<Customer, Long> {
	
	List<Customer> findByStoreOrderById(Store store);

	@Query(
			"select c from Customer c "+	
		    "where c.c_number = :number " +
			"order by c.id desc"
	)
	Customer findByNumber(@Param("number")int number);
}
