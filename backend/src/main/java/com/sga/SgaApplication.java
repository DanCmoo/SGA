package com.sga;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SgaApplication {

	public static void main(String[] args) {
		SpringApplication.run(SgaApplication.class, args);
	}

}