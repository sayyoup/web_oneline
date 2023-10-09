package com.yobee.oneline.repository.menu;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yobee.oneline.repository.store.Store;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

	List<Menu> findByStoreOrderById(Store store);

}
