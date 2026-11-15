package com.conectaalimento.controller;

import com.conectaalimento.model.Donation;
import com.conectaalimento.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class DonationController {

    private final DonationService service;

    public DonationController(DonationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Donation>> getAll() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Donation>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(service.search(name, category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donation> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<Donation> create(@Valid @RequestBody Donation donation) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(donation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Donation> update(@PathVariable Long id, @Valid @RequestBody Donation donation) {
        return ResponseEntity.ok(service.update(id, donation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}