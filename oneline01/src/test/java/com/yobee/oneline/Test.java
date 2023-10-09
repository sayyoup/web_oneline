package com.yobee.oneline;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.yobee.oneline.repository.store.Store;
import com.yobee.oneline.repository.store.StoreRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootTest
public class Test {

	@Autowired private StoreRepository storeRepo;
	
	@org.junit.jupiter.api.Test
	public void test() {
		List<Store> list = storeRepo.findAll();
		list.forEach(System.out::println);
	}
	
}
