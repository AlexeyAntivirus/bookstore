package com.horizonbit.bookstore.server.services;


import com.horizonbit.bookstore.server.data.entities.BookOrder;
import com.horizonbit.bookstore.server.data.repositories.OrderRepository;
import com.horizonbit.bookstore.server.data.entities.Book;
import com.horizonbit.bookstore.server.data.repositories.BookRepository;
import com.horizonbit.bookstore.server.data.exchange.MakeOrderResultDetails;
import com.horizonbit.bookstore.server.data.exchange.MakeOrderResultDto;
import com.horizonbit.bookstore.server.data.exchange.OrderFormDto;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    private final Logger logger = LogManager.getLogger(OrderService.class);
    private OrderRepository orderRepository;
    private BookRepository bookRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, BookRepository bookRepository) {
        this.orderRepository = orderRepository;
        this.bookRepository = bookRepository;
    }

    public MakeOrderResultDto makeOrder(OrderFormDto orderFormDto) {
        if (this.orderRepository.findByBookNameAndAddressAndLastNameAndFirstNameAndQuantity(
                orderFormDto.getBookName(), orderFormDto.getAddress(), orderFormDto.getLastName(),
                orderFormDto.getFirstName(), orderFormDto.getQuantity()) != null) {
            return new MakeOrderResultDto(MakeOrderResultDetails.ORDER_EXISTS);
        }

        try {
            Book byName = bookRepository.findByName(orderFormDto.getBookName());

            if (byName == null) {
                throw new RuntimeException("Could not find book '" + orderFormDto.getBookName() + "'");
            }

            BookOrder bookOrder = BookOrder.builder()
                     .lastName(orderFormDto.getLastName())
                     .firstName(orderFormDto.getFirstName())
                     .address(orderFormDto.getAddress())
                     .quantity(orderFormDto.getQuantity())
                     .book(byName)
                     .build();

            BookOrder save = orderRepository.save(bookOrder);

            this.logger.debug("BookOrder has been saved to database: " + save);

            return new MakeOrderResultDto(MakeOrderResultDetails.SUCCESSFUL);
        } catch (Exception e) {
            this.logger.debug("Could not saveBooks order to database", e);

            return new MakeOrderResultDto(MakeOrderResultDetails.FAILURE);
        }
    }
}
