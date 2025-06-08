package com.example.guesifyapi.repository;

import com.example.guesifyapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
