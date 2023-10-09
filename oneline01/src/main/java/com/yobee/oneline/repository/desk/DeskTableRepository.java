package com.yobee.oneline.repository.desk;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yobee.oneline.repository.customer.Customer;
import com.yobee.oneline.repository.menu.Menu;

public interface DeskTableRepository extends JpaRepository<DeskTable, Long>{

	List<DeskTable> findByDeskId(Long deskId);

	List<DeskTable> findByMenu(Menu menu);

	List<DeskTable> findByDesk(Desk desk);

	void deleteByDesk(Desk d);

	List<DeskTable> findByCustomer(Customer c);

}
