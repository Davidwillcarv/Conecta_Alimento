package com.conectaalimento.service;

import com.conectaalimento.model.Family;
import com.conectaalimento.repository.FamilyRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FamilyService {

    private final FamilyRepository repository;

    public FamilyService(FamilyRepository repository) {
        this.repository = repository;
    }

    public List<Family> listAll() {
        return repository.findAll();
    }

    public Family getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Família não encontrada com o id " + id));
    }

    public Family save(Family family) {
        return repository.save(family);
    }

    public Family update(Long id, Family familyData) {
        Family family = getById(id);
        family.setName(familyData.getName());
        family.setResponsibleName(familyData.getResponsibleName());
        family.setMembersCount(familyData.getMembersCount());
        family.setCity(familyData.getCity());
        family.setAddress(familyData.getAddress());
        family.setPhone(familyData.getPhone());
        return repository.save(family);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Família não encontrada com o id " + id);
        }
        repository.deleteById(id);
    }

    public List<Family> searchByName(String name) {
        if (name == null || name.isBlank()) {
            return listAll();
        }
        return repository.findByNameContainingIgnoreCase(name.trim());
    }

    public List<Family> searchByCity(String city) {
        if (city == null || city.isBlank()) {
            return listAll();
        }
        return repository.findByCityContainingIgnoreCase(city.trim());
    }
}
