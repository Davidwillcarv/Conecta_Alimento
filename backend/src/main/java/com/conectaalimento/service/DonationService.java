package com.conectaalimento.service;

import com.conectaalimento.model.Donation;
import com.conectaalimento.repository.DonationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonationService {

    private final DonationRepository repository;

    public DonationService(DonationRepository repository) {
        this.repository = repository;
    }

    public List<Donation> listAll() {
        return repository.findAll();
    }

    public Donation getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Doação não encontrada com o id " + id));
    }

    public Donation save(Donation donation) {
        return repository.save(donation);
    }

    public Donation update(Long id, Donation donationData) {
        Donation donation = getById(id);
        donation.setName(donationData.getName());
        donation.setCategory(donationData.getCategory());
        donation.setQuantity(donationData.getQuantity());
        donation.setUnit(donationData.getUnit());
        donation.setReceiveDate(donationData.getReceiveDate());
        donation.setValidDate(donationData.getValidDate());
        return repository.save(donation);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Doação não encontrada com o id " + id);
        }
        repository.deleteById(id);
    }

    public List<Donation> search(String name, String category) {
        String normalizedName = name == null ? "" : name.trim();
        String normalizedCategory = category == null ? "" : category.trim();

        if (normalizedName.isEmpty() && normalizedCategory.isEmpty()) {
            return listAll();
        }

        if (!normalizedName.isEmpty() && !normalizedCategory.isEmpty()) {
            return repository.findByNameContainingIgnoreCaseAndCategoryContainingIgnoreCase(normalizedName, normalizedCategory);
        }

        if (!normalizedName.isEmpty()) {
            return repository.findByNameContainingIgnoreCase(normalizedName);
        }

        return repository.findByCategoryContainingIgnoreCase(normalizedCategory);
    }
}