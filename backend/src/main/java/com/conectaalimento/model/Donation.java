package com.conectaalimento.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "doacao")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do item é obrigatório.")
    private String name;

    @NotBlank(message = "A categoria é obrigatória.")
    private String category;

    @NotNull(message = "A quantidade é obrigatória.")
    @Min(value = 1, message = "A quantidade deve ser maior que zero.")
    private Integer quantity;

    @NotBlank(message = "A unidade de medida é obrigatória.")
    private String unit;

    private LocalDate receiveDate;

    @NotNull(message = "A data de validade é obrigatória.")
    @FutureOrPresent(message = "A data de validade deve ser atual ou futura.")
    private LocalDate validDate;

    public Donation() {
        // Construtor padrão para JPA
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public LocalDate getReceiveDate() { return receiveDate; }
    public void setReceiveDate(LocalDate receiveDate) { this.receiveDate = receiveDate; }
    public LocalDate getValidDate() { return validDate; }
    public void setValidDate(LocalDate validDate) { this.validDate = validDate; }
}