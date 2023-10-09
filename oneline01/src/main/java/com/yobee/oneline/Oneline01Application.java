package com.yobee.oneline;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class Oneline01Application {

	public static void main(String[] args) {
		SpringApplication.run(Oneline01Application.class, args);
	}

}
