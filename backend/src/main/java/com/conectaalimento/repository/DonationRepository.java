package com.conectaalimento.repository;

import com.conectaalimento.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByNameContainingIgnoreCase(String name);
    List<Donation> findByCategoryContainingIgnoreCase(String category);
    List<Donation> findByNameContainingIgnoreCaseAndCategoryContainingIgnoreCase(String name, String category);
}