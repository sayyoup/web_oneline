package com.yobee.oneline.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import lombok.RequiredArgsConstructor;


// @Configuration : 스프링 컨테이너에서 bean(객체)로 생성하고 관리하며, 필요한곳에 의존성 주입을 해준다.
// 일종의 컨트롤러나 서비스와같이 특정한 주소가 입력되었을때 처리하는것
@Configuration
// @EnableWebSecurity: 시큐리티 설정을 해당 클래스 내부에서 쓰겠다는 어노테이션
@EnableWebSecurity
// @EnableWebSecurity: 시큐리티 설정을 각각의 컨트롤러에서 쓰겠다는 어노테이션
@EnableMethodSecurity
public class SecurityConfig {

	
	// security 5버전 이후에 비밀번호는 반드시 암호화 해야한다. -> 비밀번호 인코더객체가 반드시 필요하다
	// Password Encoder : (비밀번호 암호화 해주는 객체) 
	// * 	만일 비밀번호 암호화 하지 않으면 403 (access denied, 접근 거부)
	// * 	HTTP 500(internal server error내부서버 오류 발생)
	// @Bean : xml에서 bin설정과 같다
	@Bean
	public PasswordEncoder passwordEncoder() {
		// 암호화 알고리즘중 하나 BCryptPasswordEncoder()
		return new BCryptPasswordEncoder();
	}
	
	// 로그인 할때 사용할 임시 사용자(메모리에 잠깐 저장) 생성
	/*
	@Bean
	public UserDetailsService inMemoryUserDetailsService() {
		// 임시로 만들어 꺼낼 유저정보 설정
		// 아이디: withUsername("아이디");							 <- 필수
		// 비밀번호: password(passwordEncoder().encode("비밀번호")); <- 필수
		// 권한: roles("권한 이름"); <- 일종의 옵션
		
		UserDetails user1 = User.withUsername("user1").password(passwordEncoder().encode("1111")).roles("USER").build();		
		UserDetails user2 = User.withUsername("user2").password(passwordEncoder().encode("2222")).roles("USER","ADMIN").build();
		UserDetails user3 = User.withUsername("user3").password(passwordEncoder().encode("3333")).roles("ADMIN").build();
		
		return new InMemoryUserDetailsManager(user1, user2, user3);
	}
	 * */
	
	// security filter의 설정 Bean : 로그인/로그아웃 설정 , 로그인 페이지 설정, 페이지 접근 권한(로그인 없이 접근 가능한 페이지구분)
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		// csrf : 다른 사이트에서 주소로 들어오는 접근을 막아준다(요청시 csrf토큰을 같이 받아올수 있도록 한다.)
		// 우선은 비활성화(axios 사용시 토큰을 요구해 오류가 나기때문)
		http.csrf((csrf) -> csrf.disable());
		
		// 로그인 페이지 설정 - 스프링에서 제공하는 기본 로그인 페이지를 사용.
		http.formLogin(formLogin -> formLogin
				.loginPage("/login")
				.defaultSuccessUrl("/main/select"));
		
		http.logout((logout)-> logout.logoutSuccessUrl("/"));
		
		// 페이지 접근 권한 페이지 설정
		// requestMatchers("요청주소")에 들어가기 위해선,
		// hasRole("권한")권한을 가져야 한다,
		// 그외requestMatchers("/**")(모든 사이트)는, <-- * 순서가 중요함 먼저쓰면 위에가 의미없어진다.
		// permitAll() 접근이 가능하다.
		
		// *** requestMatchers와 같이쓸수는 없지만, .authenticated()를 사용하면 아이디만 일치하면 접근이 가능하게도 사용할 수 있다.
		/*
		사용법 
			1. SecurityConfig에서는 @EnableMethodSecurity 애너테이션을 설정
			2. 각각으 컨트롤러 메서드에 @PreAuthorize 또는 @PostAuthorize 둘중하나 사용
		 * */
		
		
		/* 단점 : 새로운 경로, 컨트롤러를 작성할때 마다 자바 코드를 수정해야한다.
		http.authorizeHttpRequests((authRequest) -> 
			{ 
			authRequest
				.requestMatchers("/post/create", "/post/delete", "/post/detail", "/post/modify", "/post/update","/api/reply/**")
				.hasRole("USER")
				.requestMatchers("/**")
				.permitAll();
			}
		);
		*/
		return http.build();
	}	
}