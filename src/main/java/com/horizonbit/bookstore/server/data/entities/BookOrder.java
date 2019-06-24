package com.horizonbit.bookstore.server.data.entities;

import lombok.*;

import javax.persistence.*;

@Entity
@Table
@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PACKAGE)
@AllArgsConstructor(access = AccessLevel.PACKAGE)
public class BookOrder {

    @Id
    @GeneratedValue
    private Long id;

    @Column
    private String lastName;

    @Column
    private String firstName;

    @Column
    private String address;

    @Column
    private int quantity;

    @OneToOne
    @JoinColumn
    private Book book;
}
