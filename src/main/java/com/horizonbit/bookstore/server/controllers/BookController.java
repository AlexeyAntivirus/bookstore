package com.horizonbit.bookstore.server.controllers;


import com.horizonbit.bookstore.server.data.entities.Book;
import com.horizonbit.bookstore.server.data.exchange.MakeOrderResultDto;
import com.horizonbit.bookstore.server.data.exchange.ManageBookResultDto;
import com.horizonbit.bookstore.server.data.exchange.OrderFormDto;
import com.horizonbit.bookstore.server.services.BookService;
import com.horizonbit.bookstore.server.services.OrderService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/book")
public class BookController {

    private final Logger logger = LogManager.getLogger(BookController.class);

    private OrderService orderService;
    private BookService bookService;

    @Autowired
    public BookController(OrderService orderService, BookService bookService) {
        this.orderService = orderService;
        this.bookService = bookService;
    }

    @GetMapping("/all")
    public List<Book> getAllBooks() {
        return this.bookService.findAll();
    }

    @PutMapping("/order")
    public MakeOrderResultDto makeOrder(@RequestBody OrderFormDto orderFormDto) {
        logger.debug("Received order info: " + orderFormDto);
        return orderService.makeOrder(orderFormDto);
    }

    @PutMapping("/add")
    public ManageBookResultDto addBook(@RequestBody Book book) {
        logger.debug("Received book info: " + book);
        return this.bookService.addBook(book);
    }

    @PostMapping("/update")
    public ManageBookResultDto updateBook(@RequestBody Book book) {
        logger.debug("Received book info: " + book);
        return this.bookService.updateBook(book);
    }
}
