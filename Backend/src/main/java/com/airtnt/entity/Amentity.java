package com.airtnt.entity;

import java.util.Objects;

import javax.persistence.*;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "amentities")
public class Amentity extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "icon_image", columnDefinition = "TEXT NOT NULL")
    private String iconImage;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    private boolean prominent;
    private boolean favorite;
    private boolean safe;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "amtcategory_id")
    private AmentityCategory amentityCategory;

    public Amentity(int id) {
        super(id);
    }

    public Amentity(int id, String name, String description, AmentityCategory amentityCategory) {
        super(id);
        this.name = name;
        this.description = description;
        this.amentityCategory = amentityCategory;
    }

    public Amentity(String name, String description, AmentityCategory amentityCategory) {
        this.name = name;
        this.description = description;
        this.amentityCategory = amentityCategory;
    }

    public Amentity(String name, String description, String type) {
        this.name = name;
        this.description = description;
        switch (type) {
            case "prominent": {
                this.prominent = true;
                this.favorite = false;
                this.safe = false;
                break;
            }
            case "favorite": {
                this.prominent = false;
                this.favorite = true;
                this.safe = false;
                break;
            }
            case "safe": {
                this.prominent = false;
                this.favorite = false;
                this.safe = true;
                break;
            }

        }
    }

    public Amentity(int id, String name, String description, String type) {
        super(id);
        this.name = name;
        this.description = description;
        switch (type) {
            case "prominent": {
                this.prominent = true;
                this.favorite = false;
                this.safe = false;
                break;
            }
            case "favorite": {
                this.prominent = false;
                this.favorite = true;
                this.safe = false;
                break;
            }
            case "safe": {
                this.prominent = false;
                this.favorite = false;
                this.safe = true;
                break;
            }

        }
    }

    public Amentity(int id, String name, String description, AmentityCategory amentityCategory, String type) {
        super(id);
        this.name = name;
        this.description = description;
        this.amentityCategory = amentityCategory;
        switch (type) {
            case "prominent": {
                this.prominent = true;
                this.favorite = false;
                this.safe = false;
                break;
            }
            case "favorite": {
                this.prominent = false;
                this.favorite = true;
                this.safe = false;
                break;
            }
            case "safe": {
                this.prominent = false;
                this.favorite = false;
                this.safe = true;
                break;
            }

        }
    }

    public Amentity(String name, String description, AmentityCategory amentityCategory, String type) {
        this.name = name;
        this.description = description;
        this.amentityCategory = amentityCategory;
        switch (type) {
            case "prominent": {
                this.prominent = true;
                this.favorite = false;
                this.safe = false;
                break;
            }
            case "favorite": {
                this.prominent = false;
                this.favorite = true;
                this.safe = false;
                break;
            }
            case "safe": {
                this.prominent = false;
                this.favorite = false;
                this.safe = true;
                break;
            }

        }
    }

    @Transient
    public String getIconImagePath() {
        return "/amentity_images/" + this.iconImage;
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.getId(), amentityCategory, description, favorite, iconImage, name, prominent, safe);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Amentity other = (Amentity) obj;
        return Objects.equals(amentityCategory, other.amentityCategory)
                && Objects.equals(description, other.description) && favorite == other.favorite
                && Objects.equals(iconImage, other.iconImage) && Objects.equals(name, other.name)
                && prominent == other.prominent && safe == other.safe;
    }

}
