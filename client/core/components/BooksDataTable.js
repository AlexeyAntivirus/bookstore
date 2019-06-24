
import Vue from "https://cdn.jsdelivr.net/npm/vue/dist/vue.esm.browser.js"
import { EventBus } from "./EventBus.js"

export const BooksDataTable = Vue.component('books-data-table', {
    template:
        `<div>
            <div class="alert alert-warning" role="alert">
                {{searchTextPlaceholder}}
            </div>
            <div class="input-group">
                <div class="input-group-append">
                    <span style="font-size: 25px;">&#128269;</span>
                </div>
                <input class="form-control" v-model="searchText" :placeholder="searchTextPlaceholder">
                <div class="input-group-prepend">
                    <select class="custom-select" v-model="searchCriteria">
                        <option>Book name</option>
                        <option>Price</option>
                        <option>Genres</option>
                        <option>Authors</option>
                        <option>Description</option>
                    </select>
                    <slot name="admin"></slot>
                </div>
            </div>
            <table class="table table-bordered table-hover">
                <thead class="thead-dark">
                    <th>Book name</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Genres</th>
                    <th>Authors</th>
                </thead>
                <tbody>
                    <tr v-for='book in searchedBooks()' :key='book.id' @click="selectBook(book)">
                        <td>{{book.name}}</td>
                        <td>{{book.price}}</td>
                        <td>{{book.description}}</td>
                        <td>{{mapGenres(book.genres)}}</td>
                        <td>{{mapAuthors(book.authors)}}</td>
                    </tr>
                </tbody>
            </table>
        </div>`,
    props: ['booksData'],
    data() {
        return {
            searchText: "",
            searchCriteria: "Book name",
            searchTextPlaceholder: "Enter book name."
        }
    },
    watch: {
        searchCriteria: function (val) {
            switch (val) {
                case "Book name":
                    this.searchTextPlaceholder = "Enter book name.";
                    break;
                case "Price":
                    this.searchTextPlaceholder = "Enter book price.";
                    break;
                case "Genres":
                    this.searchTextPlaceholder = "Enter book genres. Please, separate list of genres by comma and space, like ',  '";
                    break;
                case "Authors":
                    this.searchTextPlaceholder = "Enter book authors. Please, separate list of authors by comma and space, like ',  '";
                    break;
                case "Description":
                    this.searchTextPlaceholder = "Enter book description.";
                    break;
                default:
                    this.searchTextPlaceholder = "Enter book name.";
                    break;
            }
        }
    },
    methods: {
        mapGenres(genres) {
            let result = [];
            for (const genre of genres) {
                result.push(genre.name);
            }

            return result.join(", ");
        },
        mapAuthors(authors) {
            let result = [];
            for (const author of authors) {
                result.push(author.lastName + " " + author.firstName + " " + author.middleName)
            }

            return result.join(", ");
        },
        searchedBooks() {
            if (this.searchText === "") {
                return this.booksData;
            }

            switch (this.searchCriteria) {
                case "Book name":
                    return this.booksData.filter(element => {
                        const bookNameInLowerCase = element.name.toLowerCase();

                        return bookNameInLowerCase.includes(this.searchText.toLowerCase())
                    });
                case "Price":
                    return this.booksData.filter(element => {
                        const priceString = element.price.toString();

                        return priceString === this.searchText
                    });
                case "Description":
                    return this.booksData.filter(element => element.description.includes(this.searchText));
                case "Genres":
                    return this.booksData.filter(element => {
                        const searchTextTokens = this.searchText.toLowerCase().split(", ");

                        return searchTextTokens.every(
                            searchTextToken => searchTextToken === ""
                                ? true
                                : element.genres.some(genre => genre.name.toLowerCase().includes(searchTextToken))
                        )
                    });
                case "Authors":
                    return this.booksData.filter(element => {
                        const searchTextTokens = this.searchText.toLowerCase().split(", ");

                        return searchTextTokens.every(searchTextToken =>
                            searchTextToken === ""
                                ? true
                                : element.authors.every(author => {
                                    const lastName = author.lastName.toLowerCase();
                                    const firstName = author.firstName.toLowerCase();
                                    const middleName = author.middleName.toLowerCase();

                                    return (lastName + " " + firstName + " " + middleName).includes(searchTextToken)
                                })
                        )
                    });
                default:
                    return this.booksData;
            }
        },
        selectBook(book) {
            EventBus.$emit("BookSelected", book)
        }
    }
});