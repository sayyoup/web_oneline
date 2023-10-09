package com.yobee.oneline.repository.store;

import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.yobee.oneline.repository.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Table(name="STORE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@ToString
@SequenceGenerator(name = "STORE_SEQ_GEN", sequenceName = "STORE_SEQ", allocationSize = 1 )
public class Store extends BaseTimeEntity implements UserDetails{
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "STORE_SEQ_GEN")
	private Long id;
	
	@Column(unique = true, nullable = false)
	private String username;
	
	@Column(nullable = false)
	private String password;
	
	@Column(nullable = false)
	private String uEmail;
	
	@Column()
	private String uCode;
	
	@Column(nullable = false)
	private Role role;
	
	@Builder
	private Store(String username, String password, String u_email) {
		this.username = username;
		this.password = password;
		this.uEmail = u_email;
		this.role = Role.USER;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return Arrays.asList(new SimpleGrantedAuthority(role.getKey()));
	}

	@Override
	public boolean isAccountNonExpired() {
		// 계정이 만료되지 않았나요?
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// 계정이 잠기지 않았나여?
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// 비밀번호 만료되지 않았나여?
		return true;
	}

	@Override
	public boolean isEnabled() {
		// 유저상세정보가 활성화 되어있나요?
		return true;
	}
	
	// 시간정보 포메팅
	public String getCreatedTimeToFormat() {
		return this.getCreatedTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	}
	public String getModifiedTimeToFormat() {
		return this.getModifiedTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	}
	
}
