package com.yobee.oneline.web.rest;

import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/file/image")
public class ImageFileRestController {
	
	@PostMapping("/get/return/url")
	public ResponseEntity<String> getFileReturnReqUrl(@RequestParam("imageFile") MultipartFile imageFile, @RequestParam("name") String name){
		log.info("이미지 처리 image = {}", imageFile);
		log.info("이미지 처리 name = {}", name);
		String Url = "";
		// 파일 이름 설정
		try {
			String imageFileName = UUID.randomUUID().toString()+"_"+name+"_"+imageFile.getOriginalFilename();
			// 저장경로 설정
	        File tempFile = new File("C:/oneLineImage/menu/", imageFileName);
	        imageFile.transferTo(tempFile);
            String imageUrl = "/file/image/show/" + imageFileName;
            
            // 성공
            Url = imageUrl;
		}catch (Exception e) {
			return ResponseEntity.ok(Url);
		}
		return ResponseEntity.ok(Url);
	}
	
	@GetMapping("/show/{imageFileName}")
	public ResponseEntity<byte[]> showTheImage(@PathVariable String imageFileName) throws IOException {
		
		String imagePath = "C:/oneLineImage/menu/"+imageFileName;
        Path imagePathObj = Paths.get(imagePath);

        byte[] imageBytes = Files.readAllBytes(imagePathObj);

		return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
	}
	
}
