package com.yobee.oneline.repository.store;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long>{

	UserDetails findByUsername(String username);

	@Query("Select s from Store s where s.uEmail = :uEmail")
	Store findByUEmail(@Param("uEmail") String uEmail);


	
}
