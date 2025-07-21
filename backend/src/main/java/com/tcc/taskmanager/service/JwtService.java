package com.tcc.taskmanager.service;

import com.tcc.taskmanager.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    private final String SECRET_KEY = "VENDMjAyNUpSRGV2ZWxvcGVyQXNzZXNzbWVudFRhc2tNYW5hZ2VyU2VjdXJlSldUQmFja2VuZEFQSTIwMjU="; // cámbiala en producción
    private final long EXPIRATION_TIME = 86400000; // 1 día en milisegundos

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("email", user.getEmail())
                .claim("fullName", user.getFirstName() + " " + user.getLastName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY.getBytes())
                .compact();
    }
}
