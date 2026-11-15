package com.conectaalimento.controller;

import com.conectaalimento.model.Family;
import com.conectaalimento.service.FamilyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/families")
@CrossOrigin(origins = "*")
public class FamilyController {

    private final FamilyService service;

    public FamilyController(FamilyService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Family>> getAll() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Family>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String city) {
        if (name != null && !name.isBlank()) {
            return ResponseEntity.ok(service.searchByName(name));
        }
        if (city != null && !city.isBlank()) {
            return ResponseEntity.ok(service.searchByCity(city));
        }
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Family> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<Family> create(@Valid @RequestBody Family family) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(family));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Family> update(@PathVariable Long id, @Valid @RequestBody Family family) {
        return ResponseEntity.ok(service.update(id, family));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
