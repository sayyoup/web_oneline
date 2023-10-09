package com.yobee.oneline.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yobee.oneline.dto.user.CheckUsernameAndEmail;
import com.yobee.oneline.dto.user.LoginCheckDto;
import com.yobee.oneline.dto.user.SendCodeDto;
import com.yobee.oneline.dto.user.UserCreateDto;
import com.yobee.oneline.dto.user.settingNewPasswordPageDto;
import com.yobee.oneline.repository.customer.Customer;
import com.yobee.oneline.repository.customer.CustomerRepository;
import com.yobee.oneline.repository.desk.Desk;
import com.yobee.oneline.repository.desk.DeskRepository;
import com.yobee.oneline.repository.desk.DeskTable;
import com.yobee.oneline.repository.desk.DeskTableRepository;
import com.yobee.oneline.repository.menu.Menu;
import com.yobee.oneline.repository.menu.MenuRepository;
import com.yobee.oneline.repository.store.Store;
import com.yobee.oneline.repository.store.StoreRepository;
import com.yobee.oneline.web.UserController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class StoreService implements UserDetailsService{
	private final PasswordEncoder passwordEncoder;
	private final StoreRepository storeRepository;
	
	private final MenuRepository menuRepository;
	private final DeskRepository deskRepository;
	private final CustomerRepository customerRepository;
	private final DeskTableRepository deskTableRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		log.info("loadUserByUsername username = {}", username);
		UserDetails user = storeRepository.findByUsername(username);
		
		if(user != null) {
			return user;			
		}else {
			throw new UsernameNotFoundException(username+"을 찾을 수 없음");
		}
	}

	// 아이디 중복확인 기능
	public int findUsernameIsConfirm(String username) {
		UserDetails user = storeRepository.findByUsername(username);
		if(user != null) {
			return 1;
		}
		return 0;		
	}
	
	// 이메일 중복확인
	public int findEmailIsConfirm(String emailStr) {
		List<Store> sList = storeRepository.findAll();
		for(Store s : sList) {
			if(s.getUEmail().equals(emailStr)) {
				return 1;
			}
		}
		return 0;
	}
	
	public long createNewStroeByDto(UserCreateDto dto) {
		
		String password = passwordEncoder.encode(dto.getPassword());
		Store s = Store.builder().username(dto.getUsername()).password(password).u_email(dto.getEmail()).build();
		
		storeRepository.save(s);
		return s.getId();
	}

	// 비밀번호 찾기
	public int checkTheDtoIsCoincide(CheckUsernameAndEmail dto) {
		int idExist = findUsernameIsConfirm(dto.getNameStr());
		if(idExist==0) {
			return 1;
		}
		
		List<Store> sList = storeRepository.findAll();
		for(Store s : sList) {
			if(s.getUEmail().equals(dto.getEmailStr())) {
				if(s.getUsername().equals(dto.getNameStr())) {					
					return 0;
				}
			}
		}
		return 2;
	}

	// 회원 코드정보 변경
	@Transactional
	public void setCode(String email, String code) {
		Store s = storeRepository.findByUEmail(email);
		s.setUCode(code);
		log.info("s= {}", s);		
	}

	// 인증번호 맞는지 확인
	public int checkTheCode(SendCodeDto dto) {
		Store s = storeRepository.findByUEmail(dto.getEm());
		if(s.getUCode().equals(dto.getCode())) {	
			return 0;
		}
		return 1;
	}

	// 새비밀번호 설정
	@Transactional
	public void setNewPassword(settingNewPasswordPageDto dto) {
		Store s = storeRepository.findByUEmail(dto.getEmail());
		s.setUCode(null);
		String password = passwordEncoder.encode(dto.getPassword());
		s.setPassword(password);
	}

	public Long getStoreIdByDto(LoginCheckDto dto) {		
		UserDetails user = storeRepository.findByUsername(dto.getUsername());
		// 아이디가 있을때
		if(user!=null) {
			// 아이디 있고 암호까지 맞을때 
			if(passwordEncoder.matches(dto.getPassword(), user.getPassword())){
				List<Store> sList = storeRepository.findAll();
				for(Store s : sList) {
					if(s.getUsername().equals(dto.getUsername())) {
						return s.getId();
					}
				}
			}	
		}
		// 로그인 실패
		return 0L;
	}

	// 영업종료
	@Transactional
	public void endTheToday(long storeId) {
		// 모든  dt 다자우기 c 다지우기 m의 판매량 초기화
		Store s = storeRepository.findById(storeId).orElseThrow();
		List<Menu> mList = menuRepository.findByStoreOrderById(s);
		for(Menu m : mList) {
			List<DeskTable> dtList = deskTableRepository.findByMenu(m);
			for(DeskTable dt : dtList) {
				deskTableRepository.delete(dt);
			}
			m.setM_solded(0);
		}
		List<Customer> cList = customerRepository.findByStoreOrderById(s);
		for(Customer c : cList) {
			customerRepository.delete(c);
		}		
		List<Desk> dList = deskRepository.findByStoreOrderById(s);
		for(Desk d : dList) {
			d.setD_state(0);
			d.setD_total_price(0);
			d.setD_discount_price(0);
			d.setD_receive_price(0);
		}
	}	
}
