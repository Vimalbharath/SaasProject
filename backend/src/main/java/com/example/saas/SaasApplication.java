package com.example.saas;

import com.example.saas.model.Role;
import com.example.saas.model.User;
import com.example.saas.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SaasApplication {

    public static void main(String[] args) {
        SpringApplication.run(SaasApplication.class, args);
    }

    @Bean
    CommandLineRunner initSuperAdmin(UserRepository userRepo, PasswordEncoder encoder) {
        return args -> {
            if (userRepo.findByUsername("superadmin").isEmpty()) {
                User admin = new User("superadmin", encoder.encode("admin123"), Role.ROLE_SUPER_ADMIN, null);
                userRepo.save(admin);
                System.out.println(">>> Default Super Admin created: superadmin / admin123");
            }
        };
    }
}