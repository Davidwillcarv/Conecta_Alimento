package com.conectaalimento.service;

import com.conectaalimento.model.Donation;
import com.conectaalimento.model.Family;
import com.conectaalimento.repository.DonationRepository;
import com.conectaalimento.repository.FamilyRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DonationAndFamilyServiceTest {

    @Mock
    private DonationRepository donationRepository;

    @Mock
    private FamilyRepository familyRepository;

    @InjectMocks
    private DonationService donationService;

    @InjectMocks
    private FamilyService familyService;

    @Test
    void shouldReturnDonationById() {
        Donation donation = new Donation();
        donation.setId(10L);
        donation.setName("Arroz");
        donation.setCategory("Grãos");
        donation.setQuantity(5);
        donation.setUnit("kg");
        donation.setValidDate(LocalDate.now().plusDays(10));

        when(donationRepository.findById(10L)).thenReturn(Optional.of(donation));

        Donation found = donationService.getById(10L);

        assertNotNull(found);
        assertEquals("Arroz", found.getName());
    }

    @Test
    void shouldSaveAndSearchFamily() {
        Family family = new Family();
        family.setId(1L);
        family.setName("Silva");
        family.setCity("Campinas");
        family.setPhone("11999999999");

        when(familyRepository.save(any(Family.class))).thenReturn(family);
        when(familyRepository.findByNameContainingIgnoreCase("Sil")).thenReturn(List.of(family));

        Family saved = familyService.save(family);
        List<Family> results = familyService.searchByName("Sil");

        assertNotNull(saved);
        assertEquals(1, results.size());
        assertEquals("Silva", results.get(0).getName());
    }
}
