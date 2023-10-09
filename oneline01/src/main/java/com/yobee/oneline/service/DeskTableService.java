package com.yobee.oneline.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yobee.oneline.dto.dtable.DtableReadDto;
import com.yobee.oneline.dto.dtable.DtableSelectedDeleteDto;
import com.yobee.oneline.dto.dtable.InputCalculatorDto;
import com.yobee.oneline.dto.dtable.MenuAndDeskIdDto;
import com.yobee.oneline.dto.dtable.payModalDto;
import com.yobee.oneline.repository.desk.Desk;
import com.yobee.oneline.repository.desk.DeskRepository;
import com.yobee.oneline.repository.desk.DeskTable;
import com.yobee.oneline.repository.desk.DeskTableRepository;
import com.yobee.oneline.repository.menu.Menu;
import com.yobee.oneline.repository.menu.MenuRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class DeskTableService {

	private final DeskTableRepository deskTableRepository;
	private final MenuRepository menuRepository;
	private final DeskRepository deskRepository;

	// deskId로 해당 desk의 모든 주문 가져오기
	@Transactional(readOnly = true)
	public List<DtableReadDto> readAllDTList(Long deskId) {
		log.info("deskList 가져오기");
		List<DeskTable> dtList = deskTableRepository.findByDeskId(deskId);
		List<DtableReadDto> dtoList = new ArrayList<>();
		for(DeskTable dt : dtList) {
			dtoList.add(DtableReadDto.toEntity(dt));
		}
		return dtoList;
	}

	// 주문추가
	@Transactional
	public List<DtableReadDto> createOrUpdateNeDeskTable(MenuAndDeskIdDto dto) {		
		
		// 1찾기
		Menu m = menuRepository.findById(dto.getMenuId()).orElseThrow();
		Desk d = deskRepository.findById(dto.getDeskId()).orElseThrow();

		//------- 변경사항 저장 --------
		// 테이블 상태변화
		d.setD_state(1);
		// 메뉴 판매갯수 1 추가
		m.setM_solded(m.getM_solded()+1);		
		//------------------------------
		
		// 2 해당하는 메뉴가 이미 있는지 체크
		List<DeskTable> finddt = deskTableRepository.findByDesk(d);
		
		for(DeskTable dt : finddt) {
			// 이미 같은 메뉴의 주문건(같은메뉴 추가 주문일때) (상태 Update)
			if(dt.getMenu() == m) {
				int dt_count = (dt.getDt_count()+1); 
				int dt_price = (m.getM_price()*dt_count);
				// 있으면 찾아서 업데이트후 종료
				dt.updateCountAndPrice(dt_count, dt_price);
				return readAllDTList(dto.getDeskId());					
			}
		}
		// 없으면 새로 만들기
		int dt_count = 1;
		int dt_price = (m.getM_price()*dt_count);
		DeskTable dt2 =DeskTable.builder().menu(m).desk(d).dt_count(dt_count).dt_price(dt_price).build();
		deskTableRepository.save(dt2);
		return readAllDTList(dto.getDeskId());
	}
	
	// 전체삭제
	@Transactional
	public List<DtableReadDto> dleteAllOrederByDeskId(long deskId) {
		
		List<DeskTable> dtList = deskTableRepository.findByDeskId(deskId);
		Long mId = 0L;
		for(DeskTable dt : dtList) {
			Menu m = menuRepository.findById(dt.getMenu().getId()).orElseThrow();
			deskTableRepository.delete(dt);
			if(m.getM_name().equals("추가금")) {
				mId = m.getId();
				if(mId != 0) {
					menuRepository.deleteById(mId);
				}
			}
			// 판매량 되돌리기
			m.setM_solded(m.getM_solded()-dt.getDt_count());
		}
		//추가금 메뉴지우기
		return readAllDTList(deskId);
	}
	
	// 선택삭제
	@Transactional
	public List<DtableReadDto> dleteSelectedOrederByDeskId(DtableSelectedDeleteDto dto) {
		
		List<DeskTable> dtList = deskTableRepository.findByDeskId(dto.getDeskId());
		for(DeskTable dt : dtList) {
			Menu m = menuRepository.findById(dt.getMenu().getId()).orElseThrow();
			
			// 판매량 되돌리기
			m.setM_solded(m.getM_solded()-dt.getDt_count());
		}
		// 리스트 전체 삭제
		for(Long id : dto.getSelectedList()) {
			
			DeskTable dt = deskTableRepository.findById(id).orElseThrow();
			String name = dt.getMenu().getM_name();
			Long MId = dt.getMenu().getId();
			// 테이블 지우기
			deskTableRepository.deleteById(id);
			// 메뉴도 지우기
			if(name.equals("추가금")) {
				menuRepository.deleteById(MId);
			}
		}
		return readAllDTList(dto.getDeskId());
	}

	// 숫자 내리기, 삭제
	@Transactional
	public void countDown(Long oId) {
		DeskTable dt = deskTableRepository.findById(oId).orElseThrow();
		Menu m = dt.getMenu();
		// 판매갯수, 카운트갯수 줄이기
		m.setM_solded(m.getM_solded()-1);
		dt.setDt_count(dt.getDt_count()-1);
		
		// 만약 카운트가 0이면 삭제
		if(dt.getDt_count()<=0) {
			deskTableRepository.deleteById(oId);
		}
	}

	// 숫자올리기, 제한
	@Transactional
	public int countUp(Long oId) {
		DeskTable dt = deskTableRepository.findById(oId).orElseThrow();
		Menu m = dt.getMenu();
		
		// 만약 m 일일제고량 - 일일판매량 = 0 이면 0 리턴
		if(m.getM_stock()-m.getM_solded() <= 0) {
			return 0;
		}
		// 판매갯수 늘리고, 주문갯수 추가
		m.setM_solded(m.getM_solded()+1);
		dt.setDt_count(dt.getDt_count()+1);
		return 1;
	}
	
	// 추가금 처리
	@Transactional
	public void setAddPrice(Long deskId, int price) {

		// desk 찾기
		Desk d = deskRepository.findById(deskId).orElseThrow();
		
		List<DeskTable> dtList = deskTableRepository.findByDesk(d);
		if(dtList.size()==0) {
			d.setD_state(1);
		}
		
		// 이름 : 추가금, 금액 : price인 메뉴 생성 
		Menu m = Menu.builder().store(d.getStore()).m_name("추가금").m_description("추가금").m_category("추가금")
				.m_price(price).m_stock(99999).build();
		menuRepository.save(m);
		
		DeskTable dt = DeskTable.builder().menu(m).desk(d).dt_count(1).dt_price(price).build();
		deskTableRepository.save(dt);
	}

	@Transactional
	public int setDiscountPrice(InputCalculatorDto dto) {
		Desk d = deskRepository.findById(dto.getDeskId()).orElseThrow();
		
		d.setD_discount_price(dto.getInputCalculator());		
		
		int result = (( d.getD_total_price() - d.getD_discount_price() ) - d.getD_receive_price() );
		if(result <= 0) {
			d.setD_discount_price(0);
			d.setD_receive_price(0);
			d.setD_state(0);
			
			List<DeskTable> dtList = deskTableRepository.findByDeskId(dto.getDeskId());
			for(DeskTable dt : dtList) {
				Menu m = dt.getMenu();
				m.setM_solded(m.getM_solded()+dt.getDt_count());
			}
			return 1;
		}
		return 0;
	}

	// 모든금액 초기화
	@Transactional
	public void resetAllPrice(Long deskId) {
		Desk d = deskRepository.findById(deskId).orElseThrow();
		d.setD_discount_price(0);
		d.setD_receive_price(0);
		d.setD_total_price(0);
	}

	// 결제 완료 버튼
	@Transactional
	public int endPay(Long deskId, payModalDto dto) {
		
		
		
		// 결제 성공
		//부분 결제성공
		Desk d = deskRepository.findById(deskId).orElseThrow();
		if(dto.getRprice() - dto.getAmountOfPayment() > 0 ) {
			d.setD_receive_price(d.getD_receive_price()+dto.getAmountOfPayment());
			return 2;
		}
		// 모든 주문 건수 판매갯수 추가
		List<DeskTable> dtList = deskTableRepository.findByDesk(d);
		for(DeskTable dt : dtList) {
			Menu m = dt.getMenu();
			m.setM_solded(m.getM_solded()+dt.getDt_count());
		}
		
		// 전체결제 성공
		// 목록 전체삭제
		dleteAllOrederByDeskId(deskId);
		// 테이블상테 초기화
		d.setD_total_price(0);
		d.setD_discount_price(0);
		d.setD_receive_price(0);
		d.setD_state(0);
		return 1;
	}
	
}
