package com.conectaalimento.controller;

import com.conectaalimento.dto.LoginRequest;
import com.conectaalimento.dto.LoginResponse;
import com.conectaalimento.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final JwtService jwtService;

    @Value("${app.auth.username}")
    private String validUsername;

    @Value("${app.auth.password}")
    private String validPassword;

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        if (!validUsername.equals(request.getUsername()) || !validPassword.equals(request.getPassword())) {
            return ResponseEntity.status(401).build();
        }

        String token = jwtService.generateToken(request.getUsername());
        return ResponseEntity.ok(new LoginResponse(token));
    }
}
